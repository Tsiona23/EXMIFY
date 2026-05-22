import { useState, useCallback, useMemo } from "react";
import { NotificationContext } from "./NotificationContext.js";

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length, 
  [notifications]);

  const showNotification = useCallback((title, message, type = "info") => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      type,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      markAsRead, 
      showNotification 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};