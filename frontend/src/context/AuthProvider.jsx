import { useState, useEffect, useMemo, useCallback } from "react";
import { AuthContext } from "./AuthContext.jsx";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = () => {
            try {
                const storedUser = localStorage.getItem('user');
                const storedToken = localStorage.getItem('token');
                if (storedUser && storedToken) {
                    const parsedUser = JSON.parse(storedUser);
                    if (parsedUser && typeof parsedUser === 'object') setUser(parsedUser);
                }
            } catch {
                localStorage.clear();
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    const login = useCallback((userData, token) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        localStorage.clear();
        setUser(null);
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
    }, []);

    const value = useMemo(() => ({
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    }), [user, loading, login, logout]);

    return (
        <AuthContext.Provider value={value}>
            {!loading ? children : (
                <div className="flex items-center justify-center min-h-screen">Loading...</div>
            )}
        </AuthContext.Provider>
    );
};