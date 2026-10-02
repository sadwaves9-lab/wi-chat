import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { neuRaised } from '@theme/neumorphism';
import { Colors, Spacing } from '@theme/colors';

interface Props {
  children: React.ReactNode;
  radius?: number;
  padding?: number;
  style?: StyleProp<ViewStyle>;
  bg?: string;
  intensity?: number;
}

export const NeuCard: React.FC<Props> = ({
  children,
  radius = 22,
  padding = Spacing.lg,
  style,
  bg = Colors.base,
  intensity = 1,
}) => {
  return (
    <View style={[neuRaised(radius, intensity, bg), { padding }, style]}>
      {children}
    </View>
  );
};
