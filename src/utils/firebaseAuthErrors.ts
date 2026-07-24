import { FirebaseError } from "firebase/app";

export function getFirebaseAuthErrorMessage(
  error: unknown
) {
  if (!(error instanceof FirebaseError)) {
    return "Something went wrong. Please try again.";
  }

  switch (error.code) {
    case "auth/email-already-in-use":
      return "An account already exists with this email.";

    case "auth/invalid-email":
      return "Enter a valid email address.";

    case "auth/weak-password":
      return "The password is too weak.";

    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Incorrect email or password.";

    case "auth/network-request-failed":
      return "Network error. Check your internet connection and try again.";

    case "auth/too-many-requests":
      return "Too many attempts. Please wait and try again.";

    case "auth/user-disabled":
      return "This account has been disabled.";

    case "auth/missing-email":
      return "Please enter your email address.";

    default:
      return "Authentication failed. Please try again.";
  }
}