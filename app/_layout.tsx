import { Stack } from "expo-router";
import { AppProvider } from "../src/context/AppContext";

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="success" />
      </Stack>
    </AppProvider>
  );
}