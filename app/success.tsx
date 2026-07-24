import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "../src/components/AppButton";
import { useAppContext } from "../src/context/AppContext";

export default function SuccessScreen() {
  const router = useRouter();

  const { message } =
    useLocalSearchParams<{
      message?: string;
    }>();

  const { isDark } =
    useAppContext();

  const goToRecords = () => {
    router.replace("/(tabs)/submissions");
  };

  const goToForm = () => {
    router.replace("/(tabs)/employeeForm");
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

            borderColor: isDark
              ? "#334155"
              : "#DBEAFE",
          },
        ]}
      >
        <View style={styles.circle}>
          <Text style={styles.check}>
            ✓
          </Text>
        </View>

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
          Submitted Successfully
        </Text>

        <Text
          style={[
            styles.message,
            {
              color: isDark
                ? "#CBD5E1"
                : "#64748B",
            },
          ]}
        >
          {message ??
            "Your employee record has been saved successfully."}
        </Text>

        <AppButton
          title="View Employee Records"
          onPress={goToRecords}
        />

        <AppButton
          title="Employee Form"
          onPress={goToForm}
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