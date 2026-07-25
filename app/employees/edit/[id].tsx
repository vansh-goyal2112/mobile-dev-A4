import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

import { AppButton } from "../../../src/components/AppButton";
import { AppInput } from "../../../src/components/AppInput";
import { useAppContext } from "../../../src/context/AppContext";
import { useAuth } from "../../../src/context/AuthContext";
import { departments } from "../../../src/data/departments";
import { Employee } from "../../../src/models/Employee";
import {
    getEmployeeById,
    updateEmployee,
} from "../../../src/repositories/EmployeeRepository";

const EditEmployeeSchema = Yup.object({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(30, "First name cannot exceed 30 characters")
    .matches(/^[A-Za-z]+$/, "First name can only contain letters"),

  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(30, "Last name cannot exceed 30 characters")
    .matches(/^[A-Za-z]+$/, "Last name can only contain letters"),

  employeeId: Yup.string()
    .required("Employee ID is required")
    .matches(/^EMP[0-9]{4}$/, "Employee ID must use the format EMP1001"),

  email: Yup.string()
    .required("Email is required")
    .email("Enter a valid email address")
    .max(100, "Email cannot exceed 100 characters"),

  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must contain exactly 10 digits"),

  department: Yup.string()
    .required("Select a department")
    .oneOf(departments, "Select a valid department"),

  jobTitle: Yup.string()
    .required("Job title is required")
    .min(2, "Job title must be at least 2 characters")
    .max(50, "Job title cannot exceed 50 characters")
    .matches(/^[A-Za-z ]+$/, "Job title can only contain letters and spaces"),

  address: Yup.string()
    .required("Address is required")
    .min(10, "Address must be at least 10 characters")
    .max(150, "Address cannot exceed 150 characters"),
});

export default function EditEmployeeScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{
    id?: string;
  }>();

  const { isDark } = useAppContext();
  const { user } = useAuth();

  const [employee, setEmployee] = useState<Employee | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [loadError, setLoadError] = useState("");

  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const loadEmployee = async () => {
      if (!user) {
        setLoadError("Your session has expired. Please sign in again.");
        setIsLoading(false);
        return;
      }

      if (!id) {
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

        setLoadError(
          "Unable to load the employee record. Check your connection and try again.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployee();
  }, [id, user]);

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
          Loading employee record...
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
        <Text
          style={[
            styles.errorTitle,
            {
              color: isDark ? "white" : "#0F172A",
            },
          ]}
        >
          Unable to Edit Record
        </Text>

        <Text style={styles.errorText}>
          {loadError || "Employee record was not found."}
        </Text>

        <View style={styles.errorButtons}>
          <AppButton
            title="Back to Records"
            onPress={() => {
              router.replace("/(tabs)/submissions");
            }}
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
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.headerCard,
            {
              backgroundColor: isDark ? "#1E293B" : "#DBEAFE",
            },
          ]}
        >
          <Text
            style={[
              styles.headerTitle,
              {
                color: isDark ? "white" : "#1E3A8A",
              },
            ]}
          >
            Edit Employee
          </Text>

          <Text
            style={[
              styles.headerText,
              {
                color: isDark ? "#CBD5E1" : "#475569",
              },
            ]}
          >
            Update the employee information and save the changes to Firestore.
          </Text>
        </View>

        <View
          style={[
            styles.formCard,
            {
              backgroundColor: isDark ? "#1E293B" : "white",
            },
          ]}
        >
          <Formik
            enableReinitialize
            initialValues={{
              firstName: employee.firstName,
              lastName: employee.lastName,
              employeeId: employee.employeeId,
              email: employee.email,
              phone: employee.phone,
              department: employee.department,
              jobTitle: employee.jobTitle,
              address: employee.address,
            }}
            validationSchema={EditEmployeeSchema}
            validateOnMount
            validateOnChange
            validateOnBlur
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitError("");

              if (!user) {
                setSubmitError(
                  "Your session has expired. Please sign in again.",
                );

                setSubmitting(false);
                return;
              }

              if (!id) {
                setSubmitError("Employee information is unavailable.");

                setSubmitting(false);
                return;
              }

              try {
                await updateEmployee(id, values, user.uid);

                router.replace({
                  pathname: "/employees/[id]",
                  params: {
                    id,
                  },
                });
              } catch (error) {
                console.log(error);

                setSubmitError(
                  "Unable to update the employee record. Please try again.",
                );
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              setFieldTouched,
              isSubmitting,
              isValid,
              resetForm,
            }) => (
              <>
                <AppInput
                  label="First Name"
                  placeholder="Enter first name"
                  value={values.firstName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  onChangeText={(text) => {
                    setSubmitError("");
                    handleChange("firstName")(text);
                    setFieldTouched("firstName", true, false);
                  }}
                  onBlur={handleBlur("firstName")}
                  error={errors.firstName}
                  touched={touched.firstName}
                  valid={!!touched.firstName && !errors.firstName}
                />

                <AppInput
                  label="Last Name"
                  placeholder="Enter last name"
                  value={values.lastName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  onChangeText={(text) => {
                    setSubmitError("");
                    handleChange("lastName")(text);
                    setFieldTouched("lastName", true, false);
                  }}
                  onBlur={handleBlur("lastName")}
                  error={errors.lastName}
                  touched={touched.lastName}
                  valid={!!touched.lastName && !errors.lastName}
                />

                <AppInput
                  label="Employee ID"
                  placeholder="EMP1001"
                  value={values.employeeId}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  onChangeText={(text) => {
                    setSubmitError("");
                    handleChange("employeeId")(text.toUpperCase());
                    setFieldTouched("employeeId", true, false);
                  }}
                  onBlur={handleBlur("employeeId")}
                  error={errors.employeeId}
                  touched={touched.employeeId}
                  valid={!!touched.employeeId && !errors.employeeId}
                />

                <AppInput
                  label="Email"
                  placeholder="employee@email.com"
                  value={values.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={(text) => {
                    setSubmitError("");
                    handleChange("email")(text);
                    setFieldTouched("email", true, false);
                  }}
                  onBlur={handleBlur("email")}
                  error={errors.email}
                  touched={touched.email}
                  valid={!!touched.email && !errors.email}
                />
                <AppInput
                  label="Phone Number"
                  placeholder="4035551234"
                  value={values.phone}
                  keyboardType="phone-pad"
                  autoCorrect={false}
                  onChangeText={(text) => {
                    setSubmitError("");

                    const numbersOnly = text.replace(/[^0-9]/g, "");
                    handleChange("phone")(numbersOnly);
                    setFieldTouched("phone", true, false);
                  }}
                  onBlur={handleBlur("phone")}
                  error={errors.phone}
                  touched={touched.phone}
                  valid={!!touched.phone && !errors.phone}
                />

                <Text
                  style={[
                    styles.label,
                    {
                      color: isDark ? "#E2E8F0" : "#1E293B",
                    },
                  ]}
                >
                  Department
                </Text>

                <View
                  style={[
                    styles.pickerContainer,
                    {
                      backgroundColor: isDark ? "#0F172A" : "#368fe9",
                    },
                    touched.department &&
                      errors.department &&
                      styles.inputError,
                  ]}
                >
                  <Picker
                    selectedValue={values.department}
                    onValueChange={(value) => {
                      setSubmitError("");
                      setFieldValue("department", value);

                      setFieldTouched("department", true, false);
                    }}
                    style={{
                      color: isDark ? "white" : "#0F172A",
                    }}
                    enabled={!isSubmitting}
                  >
                    <Picker.Item label="Select department" value="" />

                    {departments.map((department) => (
                      <Picker.Item
                        key={department}
                        label={department}
                        value={department}
                      />
                    ))}
                  </Picker>
                </View>

                {touched.department && errors.department && (
                  <Text style={styles.error}>{errors.department}</Text>
                )}

                <AppInput
                  label="Job Title"
                  placeholder="Junior Developer"
                  value={values.jobTitle}
                  autoCapitalize="words"
                  autoCorrect={false}
                  onChangeText={(text) => {
                    setSubmitError("");
                    handleChange("jobTitle")(text);
                    setFieldTouched("jobTitle", true, false);
                  }}
                  onBlur={handleBlur("jobTitle")}
                  error={errors.jobTitle}
                  touched={touched.jobTitle}
                  valid={!!touched.jobTitle && !errors.jobTitle}
                />

                <AppInput
                  label="Address"
                  placeholder="Enter full address"
                  value={values.address}
                  autoCapitalize="words"
                  autoCorrect={false}
                  onChangeText={(text) => {
                    setSubmitError("");
                    handleChange("address")(text);
                    setFieldTouched("address", true, false);
                  }}
                  onBlur={handleBlur("address")}
                  error={errors.address}
                  touched={touched.address}
                  valid={!!touched.address && !errors.address}
                  multiline
                />

                {!!submitError && (
                  <Text style={styles.submitError}>{submitError}</Text>
                )}

                <AppButton
                  title="Save Changes"
                  onPress={() => {
                    handleSubmit();
                  }}
                  loading={isSubmitting}
                  disabled={!isValid || isSubmitting}
                />

                <AppButton
                  title="Reset Changes"
                  onPress={() => {
                    setSubmitError("");
                    resetForm();
                  }}
                  secondary
                  disabled={isSubmitting}
                />

                <AppButton
                  title="Cancel"
                  onPress={() => {
                    if (!id) {
                      return;
                    }
                    router.replace({
                      pathname: "/employees/[id]",
                      params: {
                        id,
                      },
                    });
                  }}
                  secondary
                  disabled={isSubmitting}
                />
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </SafeAreaView>
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

  headerCard: {
    padding: 20,
    borderRadius: 22,
    marginBottom: 18,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: "800",
  },

  headerText: {
    marginTop: 6,
    lineHeight: 22,
  },

  formCard: {
    padding: 18,
    borderRadius: 22,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    marginBottom: 16,
    overflow: "hidden",
  },

  inputError: {
    borderColor: "#DC2626",
  },

  error: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "600",
    marginTop: -8,
    marginBottom: 12,
  },

  submitError: {
    color: "#DC2626",
    fontWeight: "600",
    lineHeight: 21,
    marginBottom: 10,
  },

  errorTitle: {
    fontSize: 24,
    fontWeight: "800",
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
