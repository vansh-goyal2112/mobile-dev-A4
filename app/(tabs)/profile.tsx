import { useState } from "react";
import {
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "../../src/components/AppButton";
import { useAppContext } from "../../src/context/AppContext";
import { useAuth } from "../../src/context/AuthContext";

export default function ProfileScreen() {
  const {
    isDark,
    toggleTheme,
  } = useAppContext();

  const { user, logout } = useAuth();

  const [isSigningOut, setIsSigningOut] =
    useState(false);

  const handleLogout = async () => {
    setIsSigningOut(true);

    try {
      await logout();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? "#0F172A"
            : "#EFF6FF",
        },
      ]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDark
              ? "#1E293B"
              : "white",
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            {
              color: isDark
                ? "white"
                : "#0F172A",
            },
          ]}
        >
          Profile
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: isDark
                ? "#CBD5E1"
                : "#64748B",
            },
          ]}
        >
          Manage your account settings.
        </Text>

        <Text
          style={[
            styles.label,
            {
              color: isDark
                ? "#CBD5E1"
                : "#64748B",
            },
          ]}
        >
          Full Name
        </Text>

        <Text
          style={[
            styles.value,
            {
              color: isDark
                ? "white"
                : "#1E293B",
            },
          ]}
        >
          {user?.displayName ??
            "Not Available"}
        </Text>

        <Text
          style={[
            styles.label,
            {
              color: isDark
                ? "#CBD5E1"
                : "#64748B",
            },
          ]}
        >
          Email
        </Text>

        <Text
          style={[
            styles.value,
            {
              color: isDark
                ? "white"
                : "#1E293B",
            },
          ]}
        >
          {user?.email ??
            "No email available"}
        </Text>

        <View style={styles.themeRow}>
          <Text
            style={[
              styles.themeText,
              {
                color: isDark
                  ? "white"
                  : "#1E293B",
              },
            ]}
          >
            Dark Mode
          </Text>

          <Switch
            value={isDark}
            onValueChange={toggleTheme}
          />
        </View>

        <AppButton
          title="Sign Out"
          onPress={handleLogout}
          loading={isSigningOut}
          disabled={isSigningOut}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  card: {
    padding: 24,
    borderRadius: 22,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 22,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 18,
  },

  value: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 6,
  },

  themeRow: {
    marginTop: 32,
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  themeText: {
    fontWeight: "700",
    fontSize: 16,
  },
});