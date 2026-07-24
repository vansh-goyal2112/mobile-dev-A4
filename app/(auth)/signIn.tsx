import { useRouter } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import {
  Pressable,
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
import { PasswordInput } from "../../src/components/PasswordInput";
import { useAppContext } from "../../src/context/AppContext";
import { useAuth } from "../../src/context/AuthContext";

const validationSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Enter a valid email address"),

  password: Yup.string()
    .required("Password is required")
    .min(
      8,
      "Password must be at least 8 characters"
    ),
});

export default function SignInScreen() {
  const router = useRouter();

  const {
    isDark,
    toggleTheme,
  } = useAppContext();

  const { login } = useAuth();

  const [authError, setAuthError] =
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
              styles.title,
              {
                color: isDark
                  ? "white"
                  : "#1E3A8A",
              },
            ]}
          >
            Sign In
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: isDark
                  ? "#CBD5E1"
                  : "#475569",
              },
            ]}
          >
            Sign in to access your employee
            records.
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
              email: "",
              password: "",
            }}
            validationSchema={
              validationSchema
            }
            validateOnMount
            validateOnChange
            validateOnBlur
            onSubmit={async (
              values,
              { setSubmitting }
            ) => {
              setAuthError("");

              try {
                await login(
                  values.email,
                  values.password
                );
              } catch (error) {
                if (error instanceof Error) {
                  setAuthError(error.message);
                } else {
                  setAuthError(
                    "Unable to sign in."
                  );
                }
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
              setFieldTouched,
              isSubmitting,
              isValid,
              resetForm,
            }) => (
              <>
                <AppInput
                  label="Email"
                  placeholder="student@email.com"
                  value={values.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={(text) => {
                    setAuthError("");
                    handleChange("email")(text);
                    setFieldTouched("email");
                  }}
                  onBlur={handleBlur("email")}
                  error={errors.email}
                  touched={touched.email}
                  valid={
                    touched.email &&
                    !errors.email
                  }
                />

                <PasswordInput
                  label="Password"
                  placeholder="Enter password"
                  value={values.password}
                  onChangeText={(text) => {
                    setAuthError("");
                    handleChange("password")(text);
                    setFieldTouched("password",);
                  }}
                  onBlur={handleBlur(
                    "password"
                  )}
                  error={errors.password}
                  touched={touched.password}
                  valid={
                    touched.password &&
                    !errors.password
                  }
                />

                {authError ? (
                  <Text
                    style={styles.authError}
                  >
                    {authError}
                  </Text>
                ) : null}

                <AppButton
                  title="Sign In"
                  onPress={() =>
                    handleSubmit()
                  }
                  loading={isSubmitting}
                  disabled={
                    !isValid ||
                    isSubmitting
                  }
                />

                <AppButton
                  title="Reset Form"
                  onPress={() => {
                    setAuthError("");
                    resetForm();
                  }}
                  secondary
                  disabled={isSubmitting}
                />

                <Pressable
                  disabled={isSubmitting}
                  onPress={() => {
                    router.push(
                      "/(auth)/forgotPassword"
                    );
                  }}
                >
                  <Text
                    style={styles.forgotLink}
                  >
                    Forgot Password?
                  </Text>
                </Pressable>

                <View
                  style={styles.linkContainer}
                >
                  <Text
                    style={[
                      styles.linkText,
                      {
                        color: isDark
                          ? "#CBD5E1"
                          : "#64748B",
                      },
                    ]}
                  >
                    Don't have an account?
                  </Text>

                  <Pressable
                    disabled={isSubmitting}
                    onPress={() => {
                      router.push(
                        "/(auth)/register"
                      );
                    }}
                  >
                    <Text style={styles.link}>
                      Sign Up
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

  authError: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },

  forgotLink: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 18,
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