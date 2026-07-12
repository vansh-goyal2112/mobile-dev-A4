import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAppContext } from "../context/AppContext";

type Props = {
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  touched?: boolean;
  onChangeText: (text: string) => void;
  onBlur: (e: any) => void;
};

export function PasswordInput({
  label,
  placeholder,
  value,
  error,
  touched,
  onChangeText,
  onBlur,
}: Props) {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  const { isDark } = useAppContext();

  const togglePassword = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.label,
          {
            color: isDark ? "#E2E8F0" : "#1E293B",
          },
        ]}
      >
        {label}
      </Text>

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: isDark ? "#0F172A" : "white",
            borderColor: isDark ? "#334155" : "#CBD5E1",
          },
          isFocused && styles.focusedInput,
          touched && error && styles.inputError,
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              color: isDark ? "white" : "#0F172A",
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChangeText}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur(event);
          }}
          secureTextEntry={secureTextEntry}
        />

        <Pressable onPress={togglePassword}>
          <Ionicons
            name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
            size={22}
            color={isDark ? "#CBD5E1" : "#64748B"}
          />
        </Pressable>
      </View>

      {touched && error && (
        <Text style={styles.error}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },

  inputContainer: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  focusedInput: {
    borderColor: "#2563EB",
    borderWidth: 2,
  },

  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
  },

  inputError: {
    borderColor: "#DC2626",
  },

  error: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 6,
  },
});