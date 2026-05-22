import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.js";

export const useTheme = () => {
  const context = useContext(ThemeContext);
  // Check for undefined because we initialized createContext(undefined)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider wrapper");
  }
  return context;
};