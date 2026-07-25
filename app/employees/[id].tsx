import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "../../src/components/AppButton";
import { useAppContext } from "../../src/context/AppContext";
import { useAuth } from "../../src/context/AuthContext";
import { Employee } from "../../src/models/Employee";
import {
    deleteEmployee,
    getEmployeeById,
} from "../../src/repositories/EmployeeRepository";

export default function EmployeeDetailsScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{
    id?: string;
  }>();

  const { isDark } = useAppContext();
  const { user } = useAuth();

  const [employee, setEmployee] = useState<Employee | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isDeleting, setIsDeleting] = useState(false);

  const [loadError, setLoadError] = useState("");

  const loadEmployee = async () => {
    if (!user) {
      setEmployee(null);
      setLoadError("Your session has expired. Please sign in again.");
      setIsLoading(false);
      return;
    }

    if (!id) {
      setEmployee(null);
      setLoadError("Employee information is unavailable.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError("");

    try {
      const record = await getEmployeeById(id, user.uid);

      if (!record) {
        setEmployee(null);
        setLoadError("Employee record was not found.");
        return;
      }

      setEmployee(record);
    } catch (error) {
      console.log(error);

      setEmployee(null);
      setLoadError(
        "Unable to load the employee record. Check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEmployee();
  }, [id, user]);

  const handleDelete = async () => {
    if (!user || !employee) {
      Alert.alert(
        "Unable to Delete",
        "Employee information or your session is unavailable.",
      );
      return;
    }

    setIsDeleting(true);

    try {
      await deleteEmployee(employee.id, user.uid);

      Alert.alert(
        "Employee Deleted",
        "The employee record was deleted successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              router.replace("/(tabs)/submissions");
            },
          },
        ],
      );
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Delete Failed",
        "Unable to delete the employee record. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDelete = () => {
    if (!employee || isDeleting) {
      return;
    }

    Alert.alert(
      "Delete Employee",
      `Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: handleDelete,
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          styles.centerContainer,
          {
            backgroundColor: isDark ? "#0F172A" : "#EFF6FF",
          },
        ]}
      >
        <ActivityIndicator size="large" />

        <Text
          style={[
            styles.loadingText,
            {
              color: isDark ? "#CBD5E1" : "#64748B",
            },
          ]}
        >
          Loading employee details...
        </Text>
      </SafeAreaView>
    );
  }

  if (loadError || !employee) {
    return (
      <SafeAreaView
        style={[
          styles.centerContainer,
          {
            backgroundColor: isDark ? "#0F172A" : "#EFF6FF",
          },
        ]}
      >
        <Ionicons name="alert-circle-outline" size={68} color="#DC2626" />

        <Text
          style={[
            styles.errorTitle,
            {
              color: isDark ? "white" : "#0F172A",
            },
          ]}
        >
          Unable to Open Record
        </Text>

        <Text style={styles.errorText}>
          {loadError || "Employee record was not found."}
        </Text>

        <View style={styles.errorButtons}>
          {!!user && !!id && (
            <AppButton title="Try Again" onPress={loadEmployee} />
          )}

          <AppButton
            title="Back to Records"
            onPress={() => {
              router.replace("/(tabs)/submissions");
            }}
            secondary
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDark ? "#0F172A" : "#EFF6FF",
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              {
                backgroundColor: isDark ? "#1E293B" : "white",
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            onPress={() => {
              router.replace("/(tabs)/submissions");
            }}
            disabled={isDeleting}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDark ? "white" : "#0F172A"}
            />
          </Pressable>

          <Text
            style={[
              styles.screenTitle,
              {
                color: isDark ? "white" : "#0F172A",
              },
            ]}
          >
            Employee Details
          </Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: isDark ? "#1E293B" : "#DBEAFE",
            },
          ]}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {employee.firstName.charAt(0).toUpperCase()}
              {employee.lastName.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text
            style={[
              styles.employeeName,
              {
                color: isDark ? "white" : "#1E3A8A",
              },
            ]}
          >
            {employee.firstName} {employee.lastName}
          </Text>

          <Text
            style={[
              styles.employeeTitle,
              {
                color: isDark ? "#CBD5E1" : "#475569",
              },
            ]}
          >
            {employee.jobTitle}
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>{employee.employeeId}</Text>
          </View>
        </View>

        <View
          style={[
            styles.detailsCard,
            {
              backgroundColor: isDark ? "#1E293B" : "white",
            },
          ]}
        >
          <DetailRow
            icon="business-outline"
            label="Department"
            value={employee.department}
            isDark={isDark}
          />

          <DetailRow
            icon="mail-outline"
            label="Email"
            value={employee.email}
            isDark={isDark}
          />

          <DetailRow
            icon="call-outline"
            label="Phone Number"
            value={employee.phone}
            isDark={isDark}
          />

          <DetailRow
            icon="location-outline"
            label="Address"
            value={employee.address}
            isDark={isDark}
            last
          />
        </View>

        {!!employee.createdAt && (
          <Text
            style={[
              styles.dateText,
              {
                color: isDark ? "#94A3B8" : "#64748B",
              },
            ]}
          >
            Created on {employee.createdAt.toLocaleDateString()}
          </Text>
        )}

        <AppButton
          title="Edit Employee"
          onPress={() => {
            router.push({
              pathname: "/employees/edit/[id]",
              params: {
                id: employee.id,
              },
            });
          }}
          disabled={isDeleting}
        />

        <Pressable
          style={({ pressed }) => [
            styles.deleteButton,
            (isDeleting || pressed) && styles.disabledButton,
          ]}
          onPress={confirmDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator color="#DC2626" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={20} color="#DC2626" />

              <Text style={styles.deleteButtonText}>Delete Employee</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

type DetailRowProps = {
  icon:
    | "business-outline"
    | "mail-outline"
    | "call-outline"
    | "location-outline";
  label: string;
  value: string;
  isDark: boolean;
  last?: boolean;
};

function DetailRow({
  icon,
  label,
  value,
  isDark,
  last = false,
}: DetailRowProps) {
  return (
    <View
      style={[
        styles.detailRow,
        !last && {
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#334155" : "#E2E8F0",
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isDark ? "#0F172A" : "#EFF6FF",
          },
        ]}
      >
        <Ionicons name={icon} size={22} color="#2563EB" />
      </View>

      <View style={styles.detailText}>
        <Text
          style={[
            styles.detailLabel,
            {
              color: isDark ? "#94A3B8" : "#64748B",
            },
          ]}
        >
          {label}
        </Text>

        <Text
          style={[
            styles.detailValue,
            {
              color: isDark ? "white" : "#0F172A",
            },
          ]}
        >
          {value || "Not available"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 50,
  },

  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  screenTitle: {
    fontSize: 22,
    fontWeight: "800",
  },

  headerPlaceholder: {
    width: 44,
  },

  profileCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 18,
  },

  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  avatarText: {
    color: "white",
    fontSize: 30,
    fontWeight: "800",
  },

  employeeName: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
  },

  employeeTitle: {
    fontSize: 16,
    marginTop: 5,
  },

  badge: {
    marginTop: 14,
    backgroundColor: "#2563EB",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },

  badgeText: {
    color: "white",
    fontSize: 13,
    fontWeight: "700",
  },

  detailsCard: {
    paddingHorizontal: 18,
    borderRadius: 22,
    marginBottom: 14,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  detailText: {
    flex: 1,
    marginLeft: 14,
  },

  detailLabel: {
    fontSize: 13,
    fontWeight: "600",
  },

  detailValue: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },

  dateText: {
    textAlign: "center",
    fontSize: 13,
    marginBottom: 10,
  },

  deleteButton: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: "#DC2626",
    borderRadius: 14,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  deleteButtonText: {
    color: "#DC2626",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },

  disabledButton: {
    opacity: 0.6,
  },

  errorTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 16,
    textAlign: "center",
  },

  errorText: {
    color: "#DC2626",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 8,
  },

  errorButtons: {
    width: "100%",
    marginTop: 20,
  },
});
