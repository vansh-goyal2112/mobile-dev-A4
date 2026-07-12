import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { useAppContext } from "../context/AppContext";

type Props = {
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  touched?: boolean;
  onChangeText: (text: string) => void;
  onBlur: (e: any) => void;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  multiline?: boolean;
};

export function AppInput({
  label,
  placeholder,
  value,
  error,
  touched,
  onChangeText,
  onBlur,
  keyboardType = "default",
  multiline = false,
}: Props) {
  const { isDark } = useAppContext();
  const [isFocused, setIsFocused] = useState(false);

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

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDark ? "#0F172A" : "white",
            color: isDark ? "white" : "#0F172A",
            borderColor: isDark ? "#334155" : "#CBD5E1",
          },
          isFocused && styles.focusedInput,
          multiline && styles.multiline,
          touched && error && styles.inputError,
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
        keyboardType={keyboardType}
        multiline={multiline}
      />

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

  input: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 15,
    fontSize: 16,
  },

  focusedInput: {
    borderColor: "#2563EB",
    borderWidth: 2,
  },

  multiline: {
    height: 110,
    textAlignVertical: "top",
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