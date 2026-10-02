import React, { useState } from 'react';
import {
  Pressable,
  StyleProp,
  ViewStyle,
  StyleSheet,
  View,
  Text,
  TextStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { neuPressed, neuRaised, neuGlow } from '@theme/neumorphism';
import { Colors, Spacing } from '@theme/colors';

interface Props {
  onPress?: () => void;
  onLongPress?: () => void;
  children?: React.ReactNode;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  radius?: number;
  padding?: number;
  glowColor?: string;
  glow?: boolean;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  haptic?: boolean;
}

export const NeuButton: React.FC<Props> = ({
  onPress,
  onLongPress,
  children,
  label,
  labelStyle,
  radius = 18,
  padding = Spacing.md,
  glowColor,
  glow = false,
  style,
  disabled = false,
  haptic = true,
}) => {
  const [pressed, setPressed] = useState(false);

  const baseStyle: ViewStyle = pressed
    ? neuPressed(radius)
    : glow
    ? neuGlow(glowColor ?? Colors.primary, radius)
    : neuRaised(radius, 0.9);

  const handlePress = () => {
    if (disabled) return;
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    onPress?.();
  };

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={handlePress}
      onLongPress={onLongPress}
      disabled={disabled}
      style={[baseStyle, { padding, opacity: disabled ? 0.5 : 1 }, style]}
    >
      {children}
      {label ? (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  label: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
