import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  secondary?: boolean;
};

export function AppButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  secondary = false,
}: Props) {
  return (
    <Pressable
      style={[
        styles.button,
        secondary && styles.secondaryButton,
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={[styles.text, secondary && styles.secondaryText]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 14,
  },
  secondaryButton: {
    backgroundColor: "#DBEAFE",
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryText: {
    color: "#1D4ED8",
  },
});