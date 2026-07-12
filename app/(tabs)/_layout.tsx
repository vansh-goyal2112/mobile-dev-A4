import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { useAppContext } from "../../src/context/AppContext";

export default function TabsLayout() {
  const { isDark } = useAppContext();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? "#60A5FA" : "#2563EB",
        tabBarInactiveTintColor: isDark ? "#94A3B8" : "#64748B",
        tabBarStyle: {
          backgroundColor: isDark ? "#1E293B" : "white",
          height: 74,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopColor: isDark ? "#334155" : "#CBD5E1",
        },
      }}
    >
      <Tabs.Screen
        name="signIn"
        options={{
          title: "Sign In",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="log-in-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="signUp"
        options={{
          title: "Sign Up",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-add-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="employeeForm"
        options={{
          title: "Employee",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}