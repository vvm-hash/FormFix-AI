import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack } from "expo-router";
import { useEffect } from "react";

function LogoutOnStart() {
  const { signOut } = useAuth();

  useEffect(() => {
    signOut();
  }, []);

  return null;
}

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <LogoutOnStart />
      <Stack screenOptions={{ headerShown: false }} />
    </ClerkProvider>
  );
}