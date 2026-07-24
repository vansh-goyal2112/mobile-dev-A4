import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

type AppButtonProps = {
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
}: AppButtonProps) {
  const isDisabled =
    disabled || loading;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        secondary &&
          styles.secondaryButton,
        isDisabled &&
          styles.disabledButton,
        pressed &&
          !isDisabled &&
          styles.pressedButton,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator
          color={
            secondary
              ? "#1D4ED8"
              : "white"
          }
        />
      ) : (
        <Text
          style={[
            styles.text,
            secondary &&
              styles.secondaryText,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },

  secondaryButton: {
    backgroundColor: "#DBEAFE",
  },

  disabledButton: {
    opacity: 0.5,
  },

  pressedButton: {
    opacity: 0.8,
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