import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useCompletion } from '../context/CompletionContext';
import { useAuth } from '../context/AuthContext';

export default function ProfileGate() {
    const { profileComplete, completionLoading } = useCompletion();
    const { isCandidate } = useAuth();
    const location = useLocation();

    if (completionLoading) {
        return (
            <div className="min-h-[calc(100vh-64px)] bg-[#f5f0eb] flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-[#b5621b] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isCandidate()) {
        return <Outlet />; // Should be caught by ProtectedRoute anyway, but pass through if not a candidate
    }

    if (!profileComplete && location.pathname !== '/complete-profile') {
        return <Navigate to="/complete-profile" replace />;
    }

    if (profileComplete && location.pathname === '/complete-profile') {
        // Prevent accessing the creation form if already complete
        return <Navigate to="/jobs" replace />;
    }

    return <Outlet />;
}
