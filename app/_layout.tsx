import { CometChat } from '@cometchat/chat-sdk-react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { COMETCHAT_CONSTANTS } from '@/constants/CometChatConfig';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [cometChatReady, setCometChatReady] = useState(false);

  useEffect(() => {
    // Initialize CometChat
    const appSettings = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(COMETCHAT_CONSTANTS.REGION)
      .build();

    CometChat.init(COMETCHAT_CONSTANTS.APP_ID, appSettings).then(
      () => {
        console.log('CometChat initialization completed successfully');
        setCometChatReady(true);
      },
      (error: any) => {
        console.log('CometChat initialization failed with error:', error);
        // Even if there's an error, we should set cometChatReady to true to avoid app freeze
        setCometChatReady(true);
      }
    );

    // Cleanup on unmount
    return () => {
      // Check if user is logged in before attempting logout
      CometChat.getLoggedinUser().then(
        (user) => {
          if (user) {
            CometChat.logout().then(
              () => console.log('Logout completed successfully'),
              (error: any) => console.log('Logout failed with error:', error)
            );
          }
        },
        () => {
          console.log('No logged in user to log out');
        }
      );
    };
  }, []);

  if (!loaded || !cometChatReady) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}