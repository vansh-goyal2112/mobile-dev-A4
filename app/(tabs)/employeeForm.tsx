import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

import { AppButton } from "../../src/components/AppButton";
import { AppInput } from "../../src/components/AppInput";
import { useAppContext } from "../../src/context/AppContext";
import { useAuth } from "../../src/context/AuthContext";
import { departments } from "../../src/data/departments";
import { createEmployee } from "../../src/repositories/EmployeeRepository";

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("First name is required")
    .min(
      2,
      "First name must be at least 2 characters"
    )
    .max(
      30,
      "First name cannot exceed 30 characters"
    )
    .matches(
      /^[A-Za-z]+$/,
      "First name can only contain letters"
    ),

  lastName: Yup.string()
    .required("Last name is required")
    .min(
      2,
      "Last name must be at least 2 characters"
    )
    .max(
      30,
      "Last name cannot exceed 30 characters"
    )
    .matches(
      /^[A-Za-z]+$/,
      "Last name can only contain letters"
    ),

  employeeId: Yup.string()
    .required("Employee ID is required")
    .matches(
      /^EMP[0-9]{4}$/,
      "Employee ID must use the format EMP1001"
    ),

  email: Yup.string()
    .required("Email is required")
    .email("Enter a valid email address")
    .matches(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      "Email format is invalid"
    )
    .max(
      100,
      "Email cannot exceed 100 characters"
    ),

  phone: Yup.string()
    .required("Phone number is required")
    .matches(
      /^[0-9]{10}$/,
      "Phone number must contain exactly 10 digits"
    ),

  department: Yup.string()
    .required("Select a department")
    .oneOf(
      departments,
      "Select a valid department"
    ),

  jobTitle: Yup.string()
    .required("Job title is required")
    .min(
      2,
      "Job title must be at least 2 characters"
    )
    .max(
      50,
      "Job title cannot exceed 50 characters"
    )
    .matches(
      /^[A-Za-z ]+$/,
      "Job title can only contain letters and spaces"
    ),

  address: Yup.string()
    .required("Address is required")
    .min(
      10,
      "Address must be at least 10 characters"
    )
    .max(
      150,
      "Address cannot exceed 150 characters"
    ),
});

export default function EmployeeFormScreen() {
  const router = useRouter();

  const {
    isDark,
    toggleTheme,
  } = useAppContext();

  const { user } = useAuth();

  const [submitError, setSubmitError] =
    useState("");

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
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.headerCard,
            {
              backgroundColor: isDark
                ? "#1E293B"
                : "#DBEAFE",
            },
          ]}
        >
          <Text
            style={[
              styles.headerTitle,
              {
                color: isDark
                  ? "white"
                  : "#1E3A8A",
              },
            ]}
          >
            Employee Form
          </Text>

          <Text
            style={[
              styles.headerText,
              {
                color: isDark
                  ? "#CBD5E1"
                  : "#475569",
              },
            ]}
          >
            Submit a validated employee record
            to Firestore.
          </Text>

          <View style={styles.themeRow}>
            <Text
              style={[
                styles.themeText,
                {
                  color: isDark
                    ? "white"
                    : "#1E293B",
                },
              ]}
            >
              Dark Mode
            </Text>

            <Switch
              value={isDark}
              onValueChange={toggleTheme}
            />
          </View>
        </View>

        <View
          style={[
            styles.formCard,
            {
              backgroundColor: isDark
                ? "#1E293B"
                : "white",
            },
          ]}
        >
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              employeeId: "",
              email: "",
              phone: "",
              department: "",
              jobTitle: "",
              address: "",
            }}
            validationSchema={
              validationSchema
            }
            validateOnMount
            validateOnChange
            validateOnBlur
            onSubmit={async (
              values,
              {
                resetForm,
                setSubmitting,
              }
            ) => {
              setSubmitError("");

              if (!user) {
                setSubmitError(
                  "Your session has expired. Please sign in again."
                );

                setSubmitting(false);
                return;
              }

              try {
                await createEmployee(
                  values,
                  user.uid
                );

                resetForm();

                router.push({
                  pathname: "/success",
                  params: {
                    message:
                      "Employee record saved successfully.",
                  },
                });
              } catch (error) {
                console.error(error);

                setSubmitError(
                  "Unable to save the employee record. Check your connection and try again."
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
                    setFieldTouched("firstName");
                  }}
                  onBlur={handleBlur(
                    "firstName"
                  )}
                  error={errors.firstName}
                  touched={
                    touched.firstName
                  }
                  valid={
                    !!touched.firstName &&
                    !errors.firstName
                  }
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
                    setFieldTouched("lastName",);
                  }}
                  onBlur={handleBlur(
                    "lastName"
                  )}
                  error={errors.lastName}
                  touched={
                    touched.lastName
                  }
                  valid={
                    !!touched.lastName &&
                    !errors.lastName
                  }
                />

                <AppInput
                  label="Employee ID"
                  placeholder="EMP1001"
                  value={values.employeeId}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  maxLength={7}
                  onChangeText={(text) => {
                    setSubmitError("");
                    handleChange("employeeId")(text.toUpperCase());
                    setFieldTouched("employeeId",);
                  }}
                  onBlur={handleBlur(
                    "employeeId"
                  )}
                  error={errors.employeeId}
                  touched={
                    touched.employeeId
                  }
                  valid={
                    !!touched.employeeId &&
                    !errors.employeeId
                  }
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
                    handleChange("email")(text.trim());
                    setFieldTouched("email");
                  }}
                  onBlur={handleBlur(
                    "email"
                  )}
                  error={errors.email}
                  touched={touched.email}
                  valid={
                    !!touched.email &&
                    !errors.email
                  }
                />

                <AppInput
                  label="Phone Number"
                  placeholder="4035551234"
                  value={values.phone}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={10}
                  onChangeText={(text) => {
                    setSubmitError("");

                    const numbersOnly =
                      text.replace(
                        /[^0-9]/g,
                        ""
                      );
                    handleChange("phone")(numbersOnly);
                    setFieldTouched("phone",);
                  }}
                  onBlur={handleBlur(
                    "phone"
                  )}
                  error={errors.phone}
                  touched={touched.phone}
                  valid={
                    !!touched.phone &&
                    !errors.phone
                  }
                />
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
                  Department
                </Text>

                <View
                  style={[
                    styles.pickerContainer,
                    {
                      backgroundColor:
                        isDark
                          ? "#0F172A"
                          : "#368fe9",

                      borderColor:
                        isDark
                          ? "#334155"
                          : "#CBD5E1",
                    },

                    touched.department &&
                    errors.department &&
                    styles.inputError,

                    touched.department &&
                    !errors.department &&
                    styles.validInput,
                  ]}
                >
                  <Picker
                    selectedValue={
                      values.department
                    }
                    onValueChange={(
                      value
                    ) => {
                      setSubmitError("");
                      setFieldValue("department", value);
                      setFieldTouched("department",);
                    }}
                    style={{
                      color: isDark
                        ? "white"
                        : "#0F172A",
                    }}
                    enabled={!isSubmitting}
                  >
                    <Picker.Item
                      label="Select department"
                      value=""
                    />

                    {departments.map(
                      (department) => (
                        <Picker.Item
                          key={department}
                          label={department}
                          value={department}
                        />
                      )
                    )}
                  </Picker>
                </View>

                {touched.department &&
                  errors.department ? (
                  <Text style={styles.error}>
                    {errors.department}
                  </Text>
                ) : null}

                <AppInput
                  label="Job Title"
                  placeholder="Junior Developer"
                  value={values.jobTitle}
                  autoCapitalize="words"
                  autoCorrect={false}
                  onChangeText={(text) => {
                    setSubmitError("");
                    handleChange("jobTitle")(text);
                    setFieldTouched("jobTitle",);
                  }}
                  onBlur={handleBlur(
                    "jobTitle"
                  )}
                  error={errors.jobTitle}
                  touched={
                    touched.jobTitle
                  }
                  valid={
                    !!touched.jobTitle &&
                    !errors.jobTitle
                  }
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
                    setFieldTouched("address");
                  }}
                  onBlur={handleBlur(
                    "address"
                  )}
                  error={errors.address}
                  touched={
                    touched.address
                  }
                  valid={
                    !!touched.address &&
                    !errors.address
                  }
                  multiline
                />

                {submitError ? (
                  <Text
                    style={styles.submitError}
                  >
                    {submitError}
                  </Text>
                ) : null}

                <AppButton
                  title="Save Employee"
                  onPress={() => {
                    handleSubmit();
                  }}
                  loading={isSubmitting}
                  disabled={
                    !isValid ||
                    isSubmitting
                  }
                />

                <AppButton
                  title="Reset Form"
                  onPress={() => {
                    setSubmitError("");
                    resetForm();
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

  themeRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  themeText: {
    fontWeight: "700",
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
    borderRadius: 14,
    marginBottom: 16,
    overflow: "hidden",
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
    marginTop: -8,
    marginBottom: 12,
  },

  submitError: {
    color: "#DC2626",
    fontWeight: "600",
    lineHeight: 21,
    marginBottom: 4,
  },
});