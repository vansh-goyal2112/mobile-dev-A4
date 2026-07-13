import { Formik } from "formik";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import * as Yup from "yup";

import { AppButton } from "../../src/components/AppButton";
import { AppInput } from "../../src/components/AppInput";
import { PasswordInput } from "../../src/components/PasswordInput";
import { useAppContext } from "../../src/context/AppContext";

const validationSchema = Yup.object({
  fullName: Yup.string()
    .required("Full name is required")
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name cannot exceed 50 characters")
    .matches(
      /^[A-Za-z ]+$/,
      "Full name can only contain letters and spaces"
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

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password cannot exceed 20 characters")
    .matches(
      /[A-Z]/,
      "Password must contain at least one uppercase letter"
    )
    .matches(
      /[a-z]/,
      "Password must contain at least one lowercase letter"
    )
    .matches(
      /[0-9]/,
      "Password must contain at least one number"
    ),

  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf(
      [Yup.ref("password")],
      "Passwords must match"
    ),
});

export default function SignUpScreen() {
  const router = useRouter();
  const { isDark, toggleTheme } = useAppContext();
  const goToSignIn = () => {
    router.push("/signIn");
  };

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
          <Text style={[styles.title, { color: isDark ? "white" : "#1E3A8A" }]}>
            Sign Up
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: isDark ? "#CBD5E1" : "#475569" },
            ]}
          >
            Create an authentication-style form with password matching.
          </Text>

          <View style={styles.themeRow}>
            <Text
              style={[
                styles.themeText,
                { color: isDark ? "white" : "#1E293B" },
              ]}
            >
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
              fullName: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            validateOnChange={true}
            validateOnBlur={true}
            onSubmit={async (values) => {
              await new Promise((resolve) => {
                setTimeout(resolve, 1500);
              });

              console.log("Sign Up Values:", values);

              router.push({
                pathname: "/success",
                params: {
                  message: "Sign up form submitted successfully.",
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
              setFieldTouched,
              isSubmitting,
              isValid,
              resetForm,
            }) => (
              <>
                <AppInput
                  label="Full Name"
                  placeholder="John Smith"
                  value={values.fullName}
                  onChangeText={(text) => {
                    handleChange("fullName")(text);
                    setFieldTouched("fullName", true, false);
                  }}
                  onBlur={handleBlur("fullName")}
                  error={errors.fullName}
                  touched={touched.fullName}
                  valid={touched.fullName && !errors.fullName}
                />

                <AppInput
                  label="Email"
                  placeholder="john@email.com"
                  value={values.email}
                  onChangeText={(text) => {
                    handleChange("email")(text);
                    setFieldTouched("email", true, false);
                  }}
                  onBlur={handleBlur("email")}
                  error={errors.email}
                  touched={touched.email}
                  valid={touched.email && !errors.email}
                />

                <PasswordInput
                  label="Password"
                  placeholder="Enter password"
                  value={values.password}
                  onChangeText={(text) => {
                    handleChange("password")(text);
                    setFieldTouched("password", true, false);
                  }}
                  onBlur={handleBlur("password")}
                  error={errors.password}
                  touched={touched.password}
                  valid={touched.password && !errors.password}
                />

                <PasswordInput
                  label="Confirm Password"
                  placeholder="Confirm password"
                  value={values.confirmPassword}
                  onChangeText={(text) => {
                    handleChange("confirmPassword")(text);
                    setFieldTouched("confirmPassword", true, false);
                  }}
                  onBlur={handleBlur("confirmPassword")}
                  error={errors.confirmPassword}
                  touched={touched.confirmPassword}
                  valid={touched.confirmPassword && !errors.confirmPassword}
                />

                <AppButton
                  title="Submit Sign Up"
                  onPress={() => handleSubmit()}
                  loading={isSubmitting}
                  disabled={!isValid}
                />

                <AppButton
                  title="Reset Form"
                  onPress={() => resetForm()}
                  secondary
                />

                <View style={styles.linkContainer}>
                  <Text
                    style={[
                      styles.linkText,
                      {
                        color: isDark ? "#CBD5E1" : "#64748B",
                      },
                    ]}
                  >
                    Already have an account?
                  </Text>

                  <Pressable onPress={goToSignIn}>
                    <Text style={styles.link}>
                      Sign In
                    </Text>
                  </Pressable>
                </View>
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
  title: {
    fontSize: 30,
    fontWeight: "800",
  },
  subtitle: {
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
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },

  linkText: {
    fontSize: 15,
  },

  link: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 6,
  },
});