import { Picker } from "@react-native-picker/picker";
import { Formik } from "formik";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import * as Yup from "yup";

import { AppButton } from "../../src/components/AppButton";
import { AppInput } from "../../src/components/AppInput";
import { departments } from "../../src/data/departments";
import { useAppContext } from "../../src/context/AppContext";

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(30, "First name cannot exceed 30 characters")
    .matches(
      /^[A-Za-z]+$/,
      "First name can only contain letters"
    ),

  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(30, "Last name cannot exceed 30 characters")
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
      100, "Email cannot exceed 100 characters"
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
      [
        "Software Development",
        "Human Resources",
        "Marketing",
        "Finance",
        "Sales",
        "Information Technology",
      ],
      "Select a valid department"
    ),

  jobTitle: Yup.string()
    .required("Job title is required")
    .min(2, "Job title must be at least 2 characters")
    .max(50, "Job title cannot exceed 50 characters")
    .matches(
      /^[A-Za-z ]+$/,
      "Job title can only contain letters and spaces"
    ),

  address: Yup.string()
    .required("Address is required")
    .min(10, "Address must be at least 10 characters")
    .max(150, "Address cannot exceed 150 characters"),
});

export default function EmployeeFormScreen() {
  const router = useRouter();
  const { isDark, toggleTheme } = useAppContext();

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#0F172A" : "#EFF6FF" },
      ]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.headerCard,
            { backgroundColor: isDark ? "#1E293B" : "#DBEAFE" },
          ]}
        >
          <Text style={[styles.headerTitle, { color: isDark ? "white" : "#1E3A8A" }]}>
            Employee Form
          </Text>
          <Text style={[styles.headerText, { color: isDark ? "#CBD5E1" : "#475569" }]}>
            Enter employee details and submit only when the form is valid.
          </Text>

          <View style={styles.themeRow}>
            <Text style={{ color: isDark ? "white" : "#1E293B", fontWeight: "700" }}>
              Dark Mode
            </Text>
            <Switch value={isDark} onValueChange={toggleTheme} />
          </View>
        </View>

        <View
          style={[
            styles.formCard,
            { backgroundColor: isDark ? "#1E293B" : "white" },
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
            validationSchema={validationSchema}
            validateOnMount={true}
            onSubmit={async (values) => {
              await new Promise((resolve) => {
                setTimeout(resolve, 1500);
              });

              console.log("Employee Form Values:", values);

              router.push({
                pathname: "/success",
                params: {
                  message: "Employee form submitted successfully.",
                },
              });
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
                  onChangeText={handleChange("firstName")}
                  onBlur={handleBlur("firstName")}
                  error={errors.firstName}
                  touched={touched.firstName}
                />

                <AppInput
                  label="Last Name"
                  placeholder="Enter last name"
                  value={values.lastName}
                  onChangeText={handleChange("lastName")}
                  onBlur={handleBlur("lastName")}
                  error={errors.lastName}
                  touched={touched.lastName}
                />

                <AppInput
                  label="Employee ID"
                  placeholder="EMP1001"
                  value={values.employeeId}
                  onChangeText={handleChange("employeeId")}
                  onBlur={handleBlur("employeeId")}
                  error={errors.employeeId}
                  touched={touched.employeeId}
                />

                <AppInput
                  label="Email"
                  placeholder="employee@email.com"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  error={errors.email}
                  touched={touched.email}
                />

                <AppInput
                  label="Phone Number"
                  placeholder="4035551234"
                  value={values.phone}
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  error={errors.phone}
                  touched={touched.phone}
                />

                <Text style={styles.label}>Department</Text>

                <View
                  style={[
                    styles.pickerContainer,
                    { backgroundColor: isDark ? "#0F172A" : "#83a4ed" },
                    touched.department && errors.department && styles.inputError,
                  ]}
                >
                  <Picker
                    selectedValue={values.department}
                    onValueChange={(value) => {
                      setFieldValue("department", value);
                    }}
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
                  onChangeText={handleChange("jobTitle")}
                  onBlur={handleBlur("jobTitle")}
                  error={errors.jobTitle}
                  touched={touched.jobTitle}
                />

                <AppInput
                  label="Address"
                  placeholder="Enter full address"
                  value={values.address}
                  onChangeText={handleChange("address")}
                  onBlur={handleBlur("address")}
                  error={errors.address}
                  touched={touched.address}
                  multiline
                />

                <AppButton
                  title="Submit Employee Form"
                  onPress={() => handleSubmit()}
                  loading={isSubmitting}
                  disabled={!isValid}
                />

                <AppButton
                  title="Reset Form"
                  onPress={() => resetForm()}
                  secondary
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
  formCard: {
    padding: 18,
    borderRadius: 22,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
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
    backgroundColor: "#FEF2F2",
  },
  error: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "600",
    marginTop: -8,
    marginBottom: 12,
  },
});