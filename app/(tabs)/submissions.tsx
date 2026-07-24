import {
  useRouter,
} from "expo-router";
import {
  useEffect,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "../../src/components/AppButton";
import { useAppContext } from "../../src/context/AppContext";
import { useAuth } from "../../src/context/AuthContext";
import { Employee } from "../../src/models/Employee";
import { getEmployees } from "../../src/repositories/EmployeeRepository";

export default function SubmissionsScreen() {
  const router = useRouter();

  const { isDark } = useAppContext();
  const { user } = useAuth();

  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [
    isRefreshing,
    setIsRefreshing,
  ] = useState(false);

  const [loadError, setLoadError] =
    useState("");

  const loadEmployees = async (refreshing = false) => {
      if (!user) {
        setEmployees([]);
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setLoadError("");

      try {
        const records =
          await getEmployees(user.uid);

        setEmployees(records);
      } catch {
        setLoadError(
          "Unable to load employee records. Check your connection and try again."
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };

  useEffect(() => {
      loadEmployees();
    }, [user]);

  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          styles.center,
          {
            backgroundColor: isDark
              ? "#0F172A"
              : "#EFF6FF",
          },
        ]}
      >
        <ActivityIndicator size="large" />

        <Text
          style={[
            styles.loadingText,
            {
              color: isDark
                ? "#CBD5E1"
                : "#64748B",
            },
          ]}
        >
          Loading employee records...
        </Text>
      </SafeAreaView>
    );
  }

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
        Employee Records
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
        Only records belonging to your
        account are displayed.
      </Text>

      {loadError ? (
        <View style={styles.messageBox}>
          <Text style={styles.error}>
            {loadError}
          </Text>

          <AppButton
            title="Try Again"
            onPress={() =>
              loadEmployees()
            }
          />
        </View>
      ) : employees.length === 0 ? (
        <View style={styles.messageBox}>
          <Text
            style={[
              styles.emptyTitle,
              {
                color: isDark
                  ? "white"
                  : "#1E293B",
              },
            ]}
          >
            No submissions yet
          </Text>

          <Text
            style={[
              styles.emptyText,
              {
                color: isDark
                  ? "#CBD5E1"
                  : "#64748B",
              },
            ]}
          >
            Submit the employee form and
            your saved record will appear
            here.
          </Text>

          <AppButton
            title="Open Employee Form"
            onPress={() =>
              router.push(
                "/(tabs)/employeeForm"
              )
            }
          />
        </View>
      ) : (
        <FlatList
          data={employees}
          keyExtractor={(item) =>
            item.id
          }
          contentContainerStyle={
            styles.list
          }
          showsVerticalScrollIndicator={
            false
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() =>
                loadEmployees(true)
              }
            />
          }
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: isDark
                    ? "#1E293B"
                    : "white",
                  opacity: pressed
                    ? 0.8
                    : 1,
                },
              ]}
              onPress={() =>
                router.push({
                  pathname:
                    "/employees/[id]",
                  params: {
                    id: item.id,
                  },
                })
              }
            >
              <Text
                style={[
                  styles.name,
                  {
                    color: isDark
                      ? "white"
                      : "#0F172A",
                  },
                ]}
              >
                {item.firstName}{" "}
                {item.lastName}
              </Text>

              <Text
                style={[
                  styles.cardText,
                  {
                    color: isDark
                      ? "#CBD5E1"
                      : "#64748B",
                  },
                ]}
              >
                {item.employeeId} •{" "}
                {item.department}
              </Text>

              <Text
                style={[
                  styles.cardText,
                  {
                    color: isDark
                      ? "#CBD5E1"
                      : "#64748B",
                  },
                ]}
              >
                {item.jobTitle}
              </Text>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  loadingText: {
    marginTop: 12,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 6,
    marginBottom: 18,
    lineHeight: 22,
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
  },

  name: {
    fontSize: 19,
    fontWeight: "800",
  },

  cardText: {
    marginTop: 5,
  },

  messageBox: {
    flex: 1,
    justifyContent: "center",
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },

  emptyText: {
    marginTop: 8,
    marginBottom: 8,
    textAlign: "center",
    lineHeight: 22,
  },

  error: {
    color: "#DC2626",
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 8,
  },
});