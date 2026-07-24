import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

type AppContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

const AppContext =
  createContext<AppContextType | undefined>(
    undefined
  );

type Props = {
  children: ReactNode;
};

export function AppProvider({
  children,
}: Props) {
  const [isDark, setIsDark] =
    useState(false);

  const toggleTheme = () => {
    setIsDark((currentValue) => {
      return !currentValue;
    });
  };

  return (
    <AppContext.Provider
      value={{
        isDark,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useAppContext must be used inside AppProvider"
    );
  }

  return context;
}