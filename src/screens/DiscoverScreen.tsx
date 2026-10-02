import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NeuButton } from '@components/NeuButton';
import { Radar } from '@components/Radar';
import { Colors, Radii, Spacing } from '@theme/colors';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { Peer, ConnectionMode } from '@types/index';
import { TcpSocketService } from '@services/TcpSocketService';
import { useChatStore } from '@store/useChatStore';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Discover'>;
type Route = RouteProp<RootStackParamList, 'Discover'>;

const modeInfo: Record<
  ConnectionMode,
  { title: string; icon: keyof typeof Ionicons.glyphMap; color: string; sub: string; prefix: string }
> = {
  wifi: {
    title: 'WiChat',
    icon: 'wifi',
    color: Colors.primary,
    sub: 'Local Wi-Fi network scan',
    prefix: '192.168.1',
  },
  bt: {
    title: 'BTChat',
    icon: 'bluetooth',
    color: Colors.secondary,
    sub: 'Bluetooth scan (dev client only)',
    prefix: '192.168.44',
  },
  hotspot: {
    title: 'HotspotChat',
    icon: 'git-network',
    color: Colors.success,
    sub: 'Hotspot client scan',
    prefix: '192.168.43',
  },
};

export const DiscoverScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const route = useRoute<Route>();
  const mode = route.params.mode;
  const info = modeInfo[mode];

  const [peers, setPeers] = useState<Peer[]>([]);
  const [scanning, setScanning] = useState(false);
  const upsertPeer = useChatStore((s) => s.upsertPeer);
  const setActivePeer = useChatStore((s) => s.setActivePeer);

  useEffect(() => {
    TcpSocketService.startServer();
    return () => {
      TcpSocketService.stopServer();
    };
  }, []);

  const scanSubnet = async (prefix: string): Promise<Peer[]> => {
    const found: Peer[] = [];
    const TcpSocket = require('react-native-tcp-socket').default;
    const tasks: Promise<void>[] = [];

    for (let i = 1; i < 255; i++) {
      const ip = `${prefix}.${i}`;
      tasks.push(
        new Promise<void>((resolve) => {
          try {
            const sock = TcpSocket.createConnection(
              { port: 8988, host: ip },
              () => {
                sock.destroy();
                found.push({
                  id: ip,
                  name: `Device ${ip}`,
                  mode,
                  status: 'discovered',
                  address: ip,
                  lastSeen: Date.now(),
                });
                resolve();
              }
            );
            sock.on('error', () => resolve());
            setTimeout(() => {
              try { sock.destroy(); } catch {}
              resolve();
            }, 600);
          } catch {
            resolve();
          }
        })
      );
    }
    await Promise.allSettled(tasks);
    return found;
  };

  const runScan = async () => {
    setScanning(true);
    setPeers([]);
    try {
      const result = await scanSubnet(info.prefix);
      setPeers(result);
      result.forEach(upsertPeer);
      if (result.length === 0) {
        Alert.alert(
          'No Devices Found',
          'Ask the other device to open WIChat and start the TCP server first. Both must be on the same Wi-Fi network.'
        );
      }
    } catch (e) {
      Alert.alert('Scan Error', String(e));
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    runScan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const connectTo = (peer: Peer) => {
    setActivePeer(peer);
    nav.navigate('Chat', { peer });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.base }}>
      <View style={styles.header}>
        <NeuButton radius={14} padding={10} onPress={() => nav.goBack()}>
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
        </NeuButton>
        <View style={styles.headerText}>
          <Ionicons name={info.icon} size={22} color={info.color} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.title}>{info.title}</Text>
            <Text style={styles.sub}>{info.sub}</Text>
          </View>
        </View>
      </View>

      <Radar scanning={scanning} color={info.color} icon={info.icon} />

      <View style={styles.statusRow}>
        <Text style={styles.statusText}>
          {scanning ? 'Scanning nearby devices' : `${peers.length} devices found`}
        </Text>
        <NeuButton
          radius={14}
          padding={10}
          onPress={() => (scanning ? setScanning(false) : runScan())}
        >
          <Text style={[styles.statusBtn, { color: info.color }]}>
            {scanning ? 'Stop' : 'Rescan'}
          </Text>
        </NeuButton>
      </View>

      <FlatList
        data={peers}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          scanning ? (
            <View style={styles.loader}>
              <ActivityIndicator color={info.color} size="large" />
            </View>
          ) : (
            <View style={styles.loader}>
              <Ionicons name="search" size={44} color={Colors.textMuted} />
              <Text style={styles.empty}>No devices found nearby</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <NeuButton
            radius={Radii.lg}
            padding={0}
            onPress={() => connectTo(item)}
            style={{ marginBottom: Spacing.md }}
          >
            <View style={styles.peerRow}>
              <View style={[styles.peerAvatar, { backgroundColor: info.color }]}>
                <Ionicons name="phone-portrait" size={22} color="#FFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.peerName}>{item.name}</Text>
                <Text style={styles.peerMeta}>{item.address ?? item.id}</Text>
              </View>
              <View style={[styles.chip, { backgroundColor: info.color + '22' }]}>
                <Text style={[styles.chipText, { color: info.color }]}>
                  Connect
                </Text>
              </View>
            </View>
          </NeuButton>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  headerText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Spacing.lg,
  },
  title: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  sub: { fontSize: 11, color: Colors.textMuted, letterSpacing: 0.6 },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.sm,
  },
  statusText: { fontSize: 13, color: Colors.textSecondary },
  statusBtn: { fontSize: 13, fontWeight: '700' },
  listContent: { padding: Spacing.xl, paddingTop: Spacing.md },
  loader: { alignItems: 'center', paddingTop: 40 },
  empty: { marginTop: 12, color: Colors.textMuted, fontSize: 13 },
  peerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  peerAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  peerName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  peerMeta: { fontSize: 11, color: Colors.textMuted, marginTop: 3 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  chipText: { fontSize: 12, fontWeight: '700' },
});
