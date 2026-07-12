import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View } from "react-native";

import { AppButton } from "../src/components/AppButton";
import { useAppContext } from "../src/context/AppContext";

export default function SuccessScreen() {
  const router = useRouter();
  const { message } = useLocalSearchParams();
  const { isDark } = useAppContext();

  const goHome = () => {
    router.push({
      pathname: "/",
    });
  };

  const goEmployeeForm = () => {
    router.push({
      pathname: "/employeeForm",
    });
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDark ? "#0F172A" : "#EFF6FF",
        },
      ]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDark ? "#1E293B" : "white",
            borderColor: isDark ? "#334155" : "#DBEAFE",
          },
        ]}
      >
        <View style={styles.circle}>
          <Text style={styles.check}>✓</Text>
        </View>

        <Text
          style={[
            styles.title,
            {
              color: isDark ? "white" : "#0F172A",
            },
          ]}
        >
          Submitted Successfully
        </Text>

        <Text
          style={[
            styles.message,
            {
              color: isDark ? "#CBD5E1" : "#64748B",
            },
          ]}
        >
          {message || "Your form has been submitted successfully."}
        </Text>

        <AppButton
          title="Employee Form"
          onPress={goEmployeeForm}
        />

        <AppButton
          title="Back Home"
          onPress={goHome}
          secondary
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
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
  },

  circle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 24,
  },

  check: {
    color: "white",
    fontSize: 50,
    fontWeight: "800",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
  },

  message: {
    textAlign: "center",
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 24,
    fontSize: 15,
  },
});