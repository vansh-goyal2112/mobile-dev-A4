import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Switch, Text, View } from "react-native";

import { AppButton } from "../src/components/AppButton";
import { useAppContext } from "../src/context/AppContext";

export default function HomeScreen() {
  const router = useRouter();
  const { isDark, toggleTheme } = useAppContext();

  const openApp = () => {
    router.push({
      pathname: "/signIn",
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
        <View style={styles.logo}>
          <Text style={styles.logoText}>EH</Text>
        </View>

        <Text
          style={[
            styles.title,
            {
              color: isDark ? "white" : "#0F172A",
            },
          ]}
        >
          EmployeeHub
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: isDark ? "#CBD5E1" : "#64748B",
            },
          ]}
        >
          A Formik and Yup validation assignment built with Expo.
        </Text>

        <View
          style={[
            styles.featureBox,
            {
              backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
            },
          ]}
        >
          <Text
            style={[
              styles.featureTitle,
              {
                color: isDark ? "white" : "#1E293B",
              },
            ]}
          >
            Included Forms
          </Text>

          <Text
            style={[
              styles.featureText,
              {
                color: isDark ? "#CBD5E1" : "#475569",
              },
            ]}
          >
            • Sign In form
          </Text>

          <Text
            style={[
              styles.featureText,
              {
                color: isDark ? "#CBD5E1" : "#475569",
              },
            ]}
          >
            • Sign Up form
          </Text>

          <Text
            style={[
              styles.featureText,
              {
                color: isDark ? "#CBD5E1" : "#475569",
              },
            ]}
          >
            • Employee information form
          </Text>
        </View>

        <View style={styles.themeRow}>
          <View>
            <Text
              style={[
                styles.themeTitle,
                {
                  color: isDark ? "white" : "#1E293B",
                },
              ]}
            >
              Dark Mode
            </Text>

            <Text
              style={[
                styles.themeText,
                {
                  color: isDark ? "#CBD5E1" : "#64748B",
                },
              ]}
            >
              Change the appearance of the app.
            </Text>
          </View>

          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{
              false: "#CBD5E1",
              true: "#60A5FA",
            }}
            thumbColor={isDark ? "#2563EB" : "#F8FAFC"}
          />
        </View>

        <AppButton title="Open Forms" onPress={openApp} />
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
    padding: 26,
    borderWidth: 1,
  },

  logo: {
    width: 84,
    height: 84,
    borderRadius: 24,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 22,
  },

  logoText: {
    color: "white",
    fontSize: 32,
    fontWeight: "800",
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },

  featureBox: {
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    marginBottom: 4,
  },

  featureTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },

  featureText: {
    marginTop: 4,
  },

  themeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 22,
    marginBottom: 6,
  },

  themeTitle: {
    fontSize: 16,
    fontWeight: "800",
  },

  themeText: {
    fontSize: 13,
    marginTop: 3,
  },
});