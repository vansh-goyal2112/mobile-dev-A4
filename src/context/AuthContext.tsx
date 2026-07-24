import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import type { User } from "firebase/auth";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { auth } from "../config/firebase";
import { getFirebaseAuthErrorMessage } from "../utils/firebaseAuthErrors";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  register: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => Promise<void>;

  resetPassword: (
    email: string
  ) => Promise<void>;
};

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

type Props = {
  children: ReactNode;
};

export function AuthProvider({
  children,
}: Props) {
  const [user, setUser] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          setUser(currentUser);
          setIsLoading(false);
        },
        () => {
          setUser(null);
          setIsLoading(false);
        }
      );

    return unsubscribe;
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<void> => {
    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );
    } catch (error) {
      throw new Error(
        getFirebaseAuthErrorMessage(error)
      );
    }
  };

  const register = async (
    fullName: string,
    email: string,
    password: string
  ): Promise<void> => {
    try {
      const result =
        await createUserWithEmailAndPassword(
          auth,
          email.trim().toLowerCase(),
          password
        );

      await updateProfile(result.user, {
        displayName: fullName.trim(),
      });
    } catch (error) {
      throw new Error(
        getFirebaseAuthErrorMessage(error)
      );
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(
        getFirebaseAuthErrorMessage(error)
      );
    }
  };

  const resetPassword = async (
    email: string
  ): Promise<void> => {
    try {
      await sendPasswordResetEmail(
        auth,
        email.trim().toLowerCase()
      );
    } catch (error) {
      throw new Error(
        getFirebaseAuthErrorMessage(error)
      );
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}