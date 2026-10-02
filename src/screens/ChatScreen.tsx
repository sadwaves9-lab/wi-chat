import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { v4 as uuid } from 'uuid';
import { NeuButton } from '@components/NeuButton';
import { NeuCard } from '@components/NeuCard';
import { ChatBubble } from '@components/ChatBubble';
import { Colors, Spacing } from '@theme/colors';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { Message } from '@types/index';
import { useChatStore } from '@store/useChatStore';
import { TcpSocketService } from '@services/TcpSocketService';

type Route = RouteProp<RootStackParamList, 'Chat'>;

export const ChatScreen: React.FC = () => {
  const route = useRoute<Route>();
  const nav = useNavigation();
  const peer = route.params.peer;

  const listRef = useRef<FlatList<Message>>(null);

  const identityId = useChatStore((s) => s.identityId) || 'me';
  const messages = useChatStore((s) => s.messagesByChat[peer.id] ?? []);
  const addMessage = useChatStore((s) => s.addMessage);
  const updateMessage = useChatStore((s) => s.updateMessage);
  const markRead = useChatStore((s) => s.markRead);

  const [draft, setDraft] = useState('');
  const [online] = useState(true);
  const [peerTyping] = useState(false);

  useEffect(() => {
    markRead(peer.id);
    const off = TcpSocketService.onMessage((m) => {
      if (m.senderId === peer.id) addMessage(m);
    });
    return () => off();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peer.id]);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  const send = async () => {
    const body = draft.trim();
    if (!body) return;
    setDraft('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

    const msg: Message = {
      id: uuid(),
      chatId: peer.id,
      senderId: identityId,
      receiverId: peer.id,
      body,
      type: 'text',
      status: 'pending',
      mode: peer.mode,
      sentAt: Date.now(),
    };
    addMessage(msg);
    scrollToEnd();

    let status: Message['status'] = 'failed';
    if (peer.address) {
      try {
        await TcpSocketService.send(peer.address, msg);
        status = 'sent';
      } catch {
        status = 'failed';
      }
    }

    updateMessage(peer.id, msg.id, { status });

    if (status === 'sent') {
      setTimeout(() => {
        updateMessage(peer.id, msg.id, {
          status: 'delivered',
          deliveredAt: Date.now(),
        });
      }, 500);
      setTimeout(() => {
        updateMessage(peer.id, msg.id, { status: 'seen', seenAt: Date.now() });
      }, 1500);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <NeuButton radius={14} padding={10} onPress={() => nav.goBack()}>
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
        </NeuButton>
        <View style={styles.avatarWrap}>
          <Ionicons name="person" size={20} color="#FFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.peerName} numberOfLines={1}>
            {peer.name}
          </Text>
          <View style={styles.statusLine}>
            <View
              style={[
                styles.dot,
                { backgroundColor: online ? Colors.success : Colors.textMuted },
              ]}
            />
            <Text style={styles.statusText}>
              {peerTyping ? 'typing...' : online ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>
        <NeuButton radius={14} padding={10} style={{ marginRight: 8 }}>
          <Ionicons name="call" size={20} color={Colors.textPrimary} />
        </NeuButton>
        <NeuButton radius={14} padding={10} style={{ marginRight: 8 }}>
          <Ionicons name="videocam" size={20} color={Colors.textPrimary} />
        </NeuButton>
        <NeuButton radius={14} padding={10}>
          <Ionicons name="ellipsis-vertical" size={20} color={Colors.textPrimary} />
        </NeuButton>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={scrollToEnd}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <NeuCard radius={999} padding={26}>
                <Ionicons
                  name="chatbubbles-outline"
                  size={40}
                  color={Colors.primary}
                />
              </NeuCard>
              <Text style={styles.emptyTitle}>Start a secure conversation</Text>
              <Text style={styles.emptySub}>
                Messages travel device to device. No server required.
              </Text>
            </View>
          }
          renderItem={({ item, index }) => {
            const isMine = item.senderId === identityId;
            const prev = messages[index - 1];
            const showTail = !prev || prev.senderId !== item.senderId;
            return (
              <ChatBubble message={item} isMine={isMine} showTail={showTail} />
            );
          }}
        />

        <View style={styles.inputRow}>
          <NeuButton radius={18} padding={12} onPress={() => {}}>
            <Ionicons name="add" size={22} color={Colors.textPrimary} />
          </NeuButton>
          <View style={{ width: 8 }} />
          <NeuCard radius={22} padding={4} style={styles.inputCard}>
            <View style={styles.inputInner}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Type a message"
                placeholderTextColor={Colors.textMuted}
                style={styles.input}
                multiline
                maxLength={4096}
              />
              <Pressable style={styles.emojiBtn} onPress={() => {}}>
                <Ionicons
                  name="happy-outline"
                  size={22}
                  color={Colors.textSecondary}
                />
              </Pressable>
            </View>
          </NeuCard>
          <View style={{ width: 8 }} />
          <NeuButton
            radius={18}
            padding={14}
            glow
            glowColor={Colors.primary}
            onPress={send}
            disabled={!draft.trim()}
          >
            <Ionicons name="send" size={20} color={Colors.primary} />
          </NeuButton>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.base },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.md,
  },
  peerName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statusLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  dot: { width: 7, height: 7, borderRadius: 4, marginRight: 5 },
  statusText: { fontSize: 11, color: Colors.textMuted },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    flexGrow: 1,
  },
  emptyWrap: { alignItems: 'center', marginTop: 60 },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 20,
  },
  emptySub: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 240,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    paddingTop: Spacing.sm,
  },
  inputCard: { flex: 1 },
  inputInner: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    maxHeight: 120,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  emojiBtn: { padding: 10 },
});
