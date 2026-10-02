import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { v4 as uuid } from 'uuid';
import * as SecureStore from 'expo-secure-store';
import { RootNavigator } from '@/navigation/RootNavigator';
import { useChatStore } from '@store/useChatStore';

export default function App() {
  const setIdentity = useChatStore((s) => s.setIdentity);
  const hydrate = useChatStore((s) => s.hydrate);

  useEffect(() => {
    (async () => {
      await hydrate();
      let id = await SecureStore.getItemAsync('wichat.device.id');
      if (!id) {
        id = uuid();
        await SecureStore.setItemAsync('wichat.device.id', id);
      }
      setIdentity(id, 'Me');
    })();
  }, [hydrate, setIdentity]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
