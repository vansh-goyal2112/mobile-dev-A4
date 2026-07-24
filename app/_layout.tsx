import { Stack } from "expo-router";
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";

import {
  AppProvider,
  useAppContext,
} from "../src/context/AppContext";
import {
  AuthProvider,
  useAuth,
} from "../src/context/AuthContext";

function RootNavigator() {
  const { user, isLoading } = useAuth();
  const { isDark } = useAppContext();

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {
            backgroundColor: isDark
              ? "#0F172A"
              : "#EFF6FF",
          },
        ]}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Protected guard={!user}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="success" />
        <Stack.Screen name="employees/[id]" />
        <Stack.Screen name="employees/edit/[id]" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});