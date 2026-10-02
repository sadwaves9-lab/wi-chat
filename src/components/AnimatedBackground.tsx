import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@theme/colors';

const { width: W, height: H } = Dimensions.get('window');

interface BlobProps {
  color: string;
  size: number;
  startX: number;
  startY: number;
  rangeX: number;
  rangeY: number;
  duration: number;
}

const Blob: React.FC<BlobProps> = ({
  color,
  size,
  startX,
  startY,
  rangeX,
  rangeY,
  duration,
}) => {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [duration, t]);

  const style = useAnimatedStyle(() => {
    const dx = interpolate(t.value, [0, 1], [-rangeX, rangeX]);
    const dy = interpolate(t.value, [0, 1], [-rangeY, rangeY]);
    const scale = interpolate(t.value, [0, 0.5, 1], [1, 1.15, 1]);
    return {
      transform: [{ translateX: dx }, { translateY: dy }, { scale }],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.blob,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          left: startX - size / 2,
          top: startY - size / 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
};

export const AnimatedBackground: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <View style={styles.root}>
      <View style={styles.base} />
      <Blob
        color="rgba(109,93,252,0.18)"
        size={W * 0.75}
        startX={W * 0.15}
        startY={H * 0.15}
        rangeX={40}
        rangeY={30}
        duration={14000}
      />
      <Blob
        color="rgba(46,134,255,0.16)"
        size={W * 0.65}
        startX={W * 0.75}
        startY={H * 0.4}
        rangeX={50}
        rangeY={40}
        duration={17000}
      />
      <Blob
        color="rgba(255,107,157,0.12)"
        size={W * 0.55}
        startX={W * 0.35}
        startY={H * 0.75}
        rangeX={60}
        rangeY={35}
        duration={20000}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.base },
  base: { ...StyleSheet.absoluteFillObject, backgroundColor: Colors.base },
  content: { flex: 1 },
  blob: { position: 'absolute' },
});
