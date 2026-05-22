import { useContext } from "react";
import { createContext } from "react";
export const NotificationContext = createContext(null); // Define NotificationContext here

export function useNotification() {
  return useContext(NotificationContext);
}