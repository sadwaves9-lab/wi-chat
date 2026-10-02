import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { HomeScreen } from '@screens/HomeScreen';
import { DiscoverScreen } from '@screens/DiscoverScreen';
import { ChatScreen } from '@screens/ChatScreen';
import { Peer, ConnectionMode } from '@types/index';

export type RootStackParamList = {
  Home: undefined;
  Discover: { mode: ConnectionMode };
  Chat: { peer: Peer };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#E0E5EC' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Discover" component={DiscoverScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
