import 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RoleRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) return null;

    const hasAccess = user && user.role && allowedRoles.includes(user.role);
    const redirectPath = user?.role === 'admin' ? '/admin' : '/exams';

    return hasAccess ? <Outlet /> : <Navigate to={user ? redirectPath : "/login"} replace />;
};

export default RoleRoute;