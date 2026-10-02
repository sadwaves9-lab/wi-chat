import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
  interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@theme/colors';
import { neuRaised } from '@theme/neumorphism';

interface Props {
  scanning: boolean;
  color?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

const Ring: React.FC<{ delay: number; color: string; scanning: boolean }> = ({
  delay,
  color,
  scanning,
}) => {
  const t = useSharedValue(0);

  useEffect(() => {
    if (scanning) {
      t.value = withDelay(
        delay,
        withRepeat(
          withTiming(1, { duration: 2000, easing: Easing.out(Easing.quad) }),
          -1,
          false
        )
      );
    } else {
      t.value = withTiming(0, { duration: 200 });
    }
  }, [scanning, delay, t]);

  const style = useAnimatedStyle(() => {
    const scale = interpolate(t.value, [0, 1], [0.3, 1.6]);
    const opacity = interpolate(t.value, [0, 0.2, 1], [0, 0.5, 0]);
    return { transform: [{ scale }], opacity };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.ring,
        { borderColor: color, borderWidth: 1.5 },
        style,
      ]}
    />
  );
};

export const Radar: React.FC<Props> = ({
  scanning,
  color = Colors.primary,
  icon = 'wifi',
}) => {
  return (
    <View style={styles.wrap}>
      <Ring delay={0} color={color} scanning={scanning} />
      <Ring delay={400} color={color} scanning={scanning} />
      <Ring delay={800} color={color} scanning={scanning} />
      <View style={[neuRaised(999, 1.2), styles.core]}>
        <Ionicons name={icon} size={36} color={color} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  core: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
