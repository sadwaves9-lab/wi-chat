export const Colors = {
  base: '#E0E5EC',
  baseDark: '#1B1D21',

  shadowDark: '#A3B1C6',
  shadowLight: '#FFFFFF',
  shadowDarkDeep: '#0F1113',
  shadowLightSoft: '#262A30',

  primary: '#6D5DFC',
  primaryDeep: '#4A3FE0',
  secondary: '#2E86FF',
  success: '#00B894',
  warning: '#F5A623',
  danger: '#E74C3C',
  accent: '#FF6B9D',

  textPrimary: '#2C3E50',
  textSecondary: '#6B7A8F',
  textMuted: '#9BA6B2',
  textOnPrimary: '#FFFFFF',

  bubbleMine: '#6D5DFC',
  bubbleOther: '#E0E5EC',
  bubbleSystem: '#D8DEE7',
};

export const Radii = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  pill: 999,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  xxl: 32,
};

export const Shadows = {
  raised: {
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.85,
    shadowRadius: 12,
    elevation: 8,
  },
  pressed: {
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  soft: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
};
