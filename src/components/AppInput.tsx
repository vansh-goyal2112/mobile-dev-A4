import { useState } from "react";
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

import { useAppContext } from "../context/AppContext";

type AppInputProps = {
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  touched?: boolean;
  valid?: boolean;
  onChangeText: (text: string) => void;
  onBlur: TextInputProps["onBlur"];

  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;

  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoCorrect?: boolean;
  secureTextEntry?: boolean;
  editable?: boolean;
  maxLength?: number;
  returnKeyType?: TextInputProps["returnKeyType"];
};

export function AppInput({
  label,
  placeholder,
  value,
  error,
  touched,
  valid,
  onChangeText,
  onBlur,

  keyboardType = "default",
  multiline = false,

  autoCapitalize = "sentences",
  autoCorrect = true,
  secureTextEntry = false,
  editable = true,
  maxLength,
  returnKeyType = "done",
}: AppInputProps) {
  const { isDark } = useAppContext();

  const [isFocused, setIsFocused] =
    useState(false);

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.label,
          {
            color: isDark
              ? "#E2E8F0"
              : "#1E293B",
          },
        ]}
      >
        {label}
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDark
              ? "#0F172A"
              : "white",

            color: isDark
              ? "white"
              : "#0F172A",

            borderColor: isDark
              ? "#334155"
              : "#CBD5E1",
          },

          isFocused && styles.focusedInput,
          multiline && styles.multiline,
          touched && error && styles.inputError,
          touched && valid && styles.validInput,
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
          onBlur?.(event);
        }}
        keyboardType={keyboardType}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        secureTextEntry={secureTextEntry}
        editable={editable}
        maxLength={maxLength}
        returnKeyType={returnKeyType}
      />

      {touched && error ? (
        <Text style={styles.error}>
          {error}
        </Text>
      ) : null}
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

  validInput: {
    borderColor: "#16A34A",
  },

  error: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 6,
  },
});