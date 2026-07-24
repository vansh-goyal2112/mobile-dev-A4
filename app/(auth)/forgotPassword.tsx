import { useRouter } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

import { AppButton } from "../../src/components/AppButton";
import { AppInput } from "../../src/components/AppInput";
import { useAppContext } from "../../src/context/AppContext";
import { useAuth } from "../../src/context/AuthContext";

const ForgotPasswordSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Enter a valid email address"),
});

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const { isDark } = useAppContext();
  const { resetPassword } = useAuth();

  const [message, setMessage] = useState("");
  const [requestError, setRequestError] =
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
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDark
              ? "#1E293B"
              : "white",
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
          Forgot Password
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
          Enter your email address and we'll
          send you a password reset link.
        </Text>

        <Formik
          initialValues={{
            email: "",
          }}
          validationSchema={
            ForgotPasswordSchema
          }
          validateOnMount
          validateOnChange
          validateOnBlur
          onSubmit={async (
            values,
            {
              setSubmitting,
              resetForm,
            }
          ) => {
            setMessage("");
            setRequestError("");

            try {
              await resetPassword(
                values.email
              );

              resetForm();

              setMessage(
                "Password reset email sent. Please check your inbox."
              );
            } catch (error) {
              if (error instanceof Error) {
                setRequestError(
                  error.message
                );
              } else {
                setRequestError(
                  "Unable to send reset email."
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
                  setMessage("");
                  setRequestError("");
                  handleChange("email")(text);
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

              {!!message && (
                <Text style={styles.success}>
                  {message}
                </Text>
              )}

              {!!requestError && (
                <Text style={styles.error}>
                  {requestError}
                </Text>
              )}

              <AppButton
                title="Send Reset Email"
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
                title="Back to Sign In"
                onPress={() =>
                  router.replace(
                    "/(auth)/signIn"
                  )
                }
                secondary
                disabled={isSubmitting}
              />
            </>
          )}
        </Formik>
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
    padding: 22,
    borderRadius: 22,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 22,
  },

  success: {
    color: "#16A34A",
    fontWeight: "600",
    marginBottom: 8,
  },

  error: {
    color: "#DC2626",
    fontWeight: "600",
    marginBottom: 8,
  },
});