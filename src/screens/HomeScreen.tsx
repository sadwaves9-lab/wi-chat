import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedBackground } from '@components/AnimatedBackground';
import { NeuCard } from '@components/NeuCard';
import { NeuButton } from '@components/NeuButton';
import { Colors, Radii, Spacing } from '@theme/colors';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { ConnectionMode } from '@types/index';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface ModeTileProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  color: string;
  mode: ConnectionMode;
  onPress: () => void;
}

const ModeTile: React.FC<ModeTileProps> = ({
  icon,
  title,
  subtitle,
  color,
  onPress,
}) => {
  return (
    <NeuButton
      onPress={onPress}
      radius={Radii.xl}
      padding={0}
      style={{ marginBottom: Spacing.lg }}
    >
      <View style={styles.tile}>
        <View
          style={[
            styles.tileIconWrap,
            { shadowColor: color },
          ]}
        >
          <Ionicons name={icon} size={30} color={color} />
        </View>
        <View style={styles.tileText}>
          <Text style={styles.tileTitle}>{title}</Text>
          <Text style={styles.tileSubtitle}>{subtitle}</Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={Colors.textMuted}
        />
      </View>
    </NeuButton>
  );
};

export const HomeScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const { width } = useWindowDimensions();

  return (
    <View style={{ flex: 1 }}>
      <AnimatedBackground>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <NeuCard
                radius={18}
                padding={14}
                style={{ marginRight: Spacing.md }}
              >
                <Ionicons name="wifi" size={26} color={Colors.primary} />
              </NeuCard>
              <View style={{ flex: 1 }}>
                <Text style={styles.appName}>WIChat</Text>
                <Text style={styles.appTag}>
                  Offline First · Peer to Peer
                </Text>
              </View>
              <NeuButton radius={16} padding={12} onPress={() => {}}>
                <Ionicons
                  name="settings-outline"
                  size={22}
                  color={Colors.textPrimary}
                />
              </NeuButton>
            </View>

            <NeuCard radius={Radii.xl} padding={22} style={styles.hero}>
              <View style={styles.heroIcon}>
                <Ionicons name="shield-checkmark" size={26} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.heroTitle}>No Internet Required</Text>
                <Text style={styles.heroSub}>
                  Direct device-to-device messages, media, and calls.
                </Text>
              </View>
            </NeuCard>

            <Text style={styles.section}>Choose Connection Mode</Text>

            <ModeTile
              icon="wifi"
              title="WiChat"
              subtitle="Wi-Fi Direct · High speed transfer"
              color={Colors.primary}
              mode="wifi"
              onPress={() => nav.navigate('Discover', { mode: 'wifi' })}
            />
            <ModeTile
              icon="bluetooth"
              title="BTChat"
              subtitle="Bluetooth Classic · Low power"
              color={Colors.secondary}
              mode="bt"
              onPress={() => nav.navigate('Discover', { mode: 'bt' })}
            />
            <ModeTile
              icon="git-network"
              title="HotspotChat"
              subtitle="Create or join a local hotspot"
              color={Colors.success}
              mode="hotspot"
              onPress={() => nav.navigate('Discover', { mode: 'hotspot' })}
            />

            <Text style={styles.footer}>
              v1.0 · Local Peer to Peer · {width.toFixed(0)}px
            </Text>
          </ScrollView>
        </SafeAreaView>
      </AnimatedBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.4,
  },
  appTag: {
    fontSize: 12,
    color: Colors.textMuted,
    letterSpacing: 1.2,
    marginTop: 2,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  heroIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    marginRight: Spacing.lg,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  heroSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  section: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  tileIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.base,
    marginRight: Spacing.lg,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  tileText: { flex: 1 },
  tileTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  tileSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 1.2,
    marginTop: Spacing.lg,
  },
});
