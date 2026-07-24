import { StyleSheet, Text, View } from "react-native";

import { useAppContext } from "../context/AppContext";

type FormTitleProps = {
  title: string;
  subtitle: string;
};

export function FormTitle({
  title,
  subtitle,
}: FormTitleProps) {
  const { isDark } = useAppContext();

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          {
            color: isDark
              ? "#F8FAFC"
              : "#0F172A",
          },
        ]}
      >
        {title}
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
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
  },

  subtitle: {
    fontSize: 15,
    marginTop: 6,
    lineHeight: 22,
  },
});