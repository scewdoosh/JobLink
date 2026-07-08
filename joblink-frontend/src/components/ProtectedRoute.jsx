import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f5f0eb] flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-[#b5621b] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // Wrong role — redirect to a sensible fallback
        const fallback = user?.role === 'EMPLOYER' ? '/my-jobs' : '/jobs';
        return <Navigate to={fallback} replace />;
    }

    return <Outlet />;
}
