import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useCompletion } from '../context/CompletionContext';
import { useAuth } from '../context/AuthContext';

export default function CompanyGate() {
    const { companyComplete, completionLoading } = useCompletion();
    const { isEmployer } = useAuth();
    const location = useLocation();

    if (completionLoading) {
        return (
            <div className="min-h-[calc(100vh-64px)] bg-[#f5f0eb] flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-[#b5621b] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isEmployer()) {
        return <Outlet />; // Pass through if not employer
    }

    if (!companyComplete && location.pathname !== '/company-profile') {
        return <Navigate to="/company-profile" replace />;
    }

    return <Outlet />;
}
