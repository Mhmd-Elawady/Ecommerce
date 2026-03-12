import { useContext } from "react";
import { AuthContext } from "../components/Context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined || context === null) {
    throw new Error(
      "[useAuth] must be used inside <AuthProvider>.\n" +
      "Make sure your component tree is wrapped with <AuthProvider>."
    );
  }

  return context;
};