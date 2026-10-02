import { Platform, ViewStyle } from 'react-native';
import { Colors } from './colors';

export function neuRaised(
  radius = 22,
  intensity = 1,
  bg: string = Colors.base
): ViewStyle {
  const base = {
    backgroundColor: bg,
    borderRadius: radius,
  };

  if (Platform.OS === 'ios') {
    return {
      ...base,
      shadowColor: Colors.shadowDark,
      shadowOffset: { width: 6 * intensity, height: 6 * intensity },
      shadowOpacity: 0.75,
      shadowRadius: 12 * intensity,
    };
  }

  return {
    ...base,
    elevation: 8 * intensity,
    shadowColor: Colors.shadowDark,
  };
}

export function neuPressed(radius = 22, bg: string = Colors.base): ViewStyle {
  const base = {
    backgroundColor: bg,
    borderRadius: radius,
  };

  if (Platform.OS === 'ios') {
    return {
      ...base,
      shadowColor: Colors.shadowDark,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
    };
  }

  return { ...base, elevation: 2 };
}

export function neuGlow(color: string, radius = 22, bg: string = Colors.base): ViewStyle {
  return {
    backgroundColor: bg,
    borderRadius: radius,
    shadowColor: color,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 10,
  };
}
