import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Chat, Message, Peer } from '@types/index';

interface ChatState {
  identityId: string;
  displayName: string;
  peers: Peer[];
  chats: Chat[];
  messagesByChat: Record<string, Message[]>;
  activePeer: Peer | null;
  scanning: boolean;

  setIdentity: (id: string, name: string) => void;
  setPeers: (peers: Peer[]) => void;
  upsertPeer: (peer: Peer) => void;
  setActivePeer: (peer: Peer | null) => void;
  setScanning: (value: boolean) => void;
  addMessage: (msg: Message) => void;
  updateMessage: (chatId: string, msgId: string, patch: Partial<Message>) => void;
  markRead: (chatId: string) => void;
  hydrate: () => Promise<void>;
  persist: () => Promise<void>;
}

const STORAGE_KEY = 'wichat.store.v1';

export const useChatStore = create<ChatState>((set, get) => ({
  identityId: '',
  displayName: 'Me',
  peers: [],
  chats: [],
  messagesByChat: {},
  activePeer: null,
  scanning: false,

  setIdentity: (id, name) => set({ identityId: id, displayName: name }),

  setPeers: (peers) => set({ peers }),

  upsertPeer: (peer) => {
    const list = [...get().peers];
    const idx = list.findIndex((p) => p.id === peer.id);
    if (idx >= 0) list[idx] = peer;
    else list.push(peer);
    set({ peers: list });
  },

  setActivePeer: (peer) => set({ activePeer: peer }),

  setScanning: (value) => set({ scanning: value }),

  addMessage: (msg) => {
    const map = { ...get().messagesByChat };
    const list = [...(map[msg.chatId] || [])];
    list.push(msg);
    map[msg.chatId] = list;

    const chats = [...get().chats];
    const idx = chats.findIndex((c) => c.id === msg.chatId);
    const preview = msg.type === 'text' ? msg.body : `[${msg.type}]`;
    if (idx >= 0) {
      chats[idx] = {
        ...chats[idx],
        lastMessage: preview,
        lastAt: msg.sentAt,
        unread: chats[idx].unread + (msg.senderId === get().identityId ? 0 : 1),
      };
    } else {
      const peer = get().peers.find((p) => p.id === msg.receiverId);
      chats.push({
        id: msg.chatId,
        peerId: msg.receiverId,
        peerName: peer?.name || msg.receiverId,
        mode: msg.mode,
        lastMessage: preview,
        lastAt: msg.sentAt,
        unread: 0,
        pinned: false,
      });
    }

    set({ messagesByChat: map, chats });
    get().persist();
  },

  updateMessage: (chatId, msgId, patch) => {
    const map = { ...get().messagesByChat };
    const list = [...(map[chatId] || [])];
    const idx = list.findIndex((m) => m.id === msgId);
    if (idx < 0) return;
    list[idx] = { ...list[idx], ...patch };
    map[chatId] = list;
    set({ messagesByChat: map });
    get().persist();
  },

  markRead: (chatId) => {
    const chats = get().chats.map((c) =>
      c.id === chatId ? { ...c, unread: 0 } : c
    );
    set({ chats });
  },

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      set({
        identityId: parsed.identityId ?? '',
        displayName: parsed.displayName ?? 'Me',
        chats: parsed.chats ?? [],
        messagesByChat: parsed.messagesByChat ?? {},
      });
    } catch {}
  },

  persist: async () => {
    try {
      const { identityId, displayName, chats, messagesByChat } = get();
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ identityId, displayName, chats, messagesByChat })
      );
    } catch {}
  },
}));
