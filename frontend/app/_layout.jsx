import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen.jsx";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store/auth.store.js";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { checkAuth, user, token } = useAuthStore();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {

    checkAuth();
    setIsReady(true); 
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = !!user && !!token;

    if (!isSignedIn && !inAuthScreen) {
      router.replace("/(auth)");
    } else if (isSignedIn && inAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [isReady, user, token, segments]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
