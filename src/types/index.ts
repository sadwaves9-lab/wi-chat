export type ConnectionMode = 'wifi' | 'bt' | 'hotspot';

export type DeviceStatus =
  | 'discovered'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'failed';

export interface Peer {
  id: string;
  name: string;
  mode: ConnectionMode;
  status: DeviceStatus;
  address?: string;
  port?: number;
  rssi?: number;
  lastSeen: number;
}

export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'seen' | 'failed';

export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'file';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  body: string;
  type: MessageType;
  status: MessageStatus;
  mode: ConnectionMode;
  sentAt: number;
  deliveredAt?: number;
  seenAt?: number;
  mediaUri?: string;
  mediaDuration?: number;
  reaction?: string;
}

export interface Chat {
  id: string;
  peerId: string;
  peerName: string;
  mode: ConnectionMode;
  lastMessage: string;
  lastAt: number;
  unread: number;
  pinned: boolean;
}
