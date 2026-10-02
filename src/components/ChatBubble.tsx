import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radii, Spacing } from '@theme/colors';
import { neuRaised, neuGlow } from '@theme/neumorphism';
import { Message } from '@types/index';

interface Props {
  message: Message;
  isMine: boolean;
  showTail: boolean;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${m} ${ampm}`;
}

const Tick: React.FC<{ status: Message['status'] }> = ({ status }) => {
  switch (status) {
    case 'pending':
      return (
        <Ionicons name="time-outline" size={13} color="rgba(255,255,255,0.8)" />
      );
    case 'sent':
      return <Ionicons name="checkmark" size={14} color="#FFFFFF" />;
    case 'delivered':
      return <Ionicons name="checkmark-done" size={14} color="#FFFFFF" />;
    case 'seen':
      return <Ionicons name="checkmark-done" size={14} color="#5EE7FF" />;
    case 'failed':
      return <Ionicons name="alert-circle-outline" size={14} color="#FFD6D6" />;
  }
};

export const ChatBubble: React.FC<Props> = ({ message, isMine, showTail }) => {
  const base = isMine
    ? neuGlow(Colors.primary, Radii.lg)
    : neuRaised(Radii.lg, 0.85);
  const textColor = isMine ? Colors.textOnPrimary : Colors.textPrimary;

  return (
    <View
      style={[
        styles.row,
        isMine ? styles.rowMine : styles.rowOther,
      ]}
    >
      <View
        style={[
          base,
          {
            paddingHorizontal: 14,
            paddingVertical: 10,
            maxWidth: '82%',
            borderTopLeftRadius: Radii.lg,
            borderTopRightRadius: Radii.lg,
            borderBottomLeftRadius: isMine ? Radii.lg : showTail ? 6 : Radii.lg,
            borderBottomRightRadius: isMine ? (showTail ? 6 : Radii.lg) : Radii.lg,
          },
        ]}
      >
        <Text style={[styles.body, { color: textColor }]}>{message.body}</Text>
        <View style={styles.meta}>
          <Text
            style={[
              styles.time,
              { color: isMine ? 'rgba(255,255,255,0.85)' : Colors.textMuted },
            ]}
          >
            {formatTime(message.sentAt)}
          </Text>
          {isMine ? (
            <View style={styles.tick}>
              <Tick status={message.status} />
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { marginVertical: 3, flexDirection: 'row' },
  rowMine: { justifyContent: 'flex-end' },
  rowOther: { justifyContent: 'flex-start' },
  body: { fontSize: 15, lineHeight: 21, fontWeight: '500' },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  time: { fontSize: 10, fontWeight: '600' },
  tick: { marginLeft: 6 },
});
