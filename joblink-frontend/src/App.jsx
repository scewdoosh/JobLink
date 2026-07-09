import { Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CompletionProvider, useCompletion } from './context/CompletionContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import PostJob from './pages/PostJob';
import MyJobs from './pages/MyJobs';
import MyApplications from './pages/MyApplications';
import Profile from './pages/Profile';
import CompanyProfile from './pages/CompanyProfile';
import PublicCompanyProfile from './pages/PublicCompanyProfile';
import PublicCandidateProfile from './pages/PublicCandidateProfile';
import About from './pages/About';
import Contact from './pages/Contact';

import './App.css';

function Layout() {
    return (
        <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <CompletionProvider>
                <ToastProvider>
                    <MainApp />
                </ToastProvider>
            </CompletionProvider>
        </AuthProvider>
    );
}

function MainApp() {
    const { isAuthenticated, isCandidate, isEmployer, loading: authLoading } = useAuth();
    const { profileComplete, companyComplete, completionLoading } = useCompletion();

    if (authLoading || completionLoading) {
        return (
            <div className="min-h-screen bg-[#f5f0eb] flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-[#b5621b] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (isAuthenticated()) {
        if (isCandidate() && !profileComplete) {
            return <Profile />;
        }
        if (isEmployer() && !companyComplete) {
            return <CompanyProfile />;
        }
    }

    return (
        <Routes>
            <Route element={<Layout />}>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* Employer-only routes */}
                <Route element={<ProtectedRoute allowedRoles={['EMPLOYER']} />}>
                    <Route path="/post-job" element={<PostJob />} />
                    <Route path="/my-jobs" element={<MyJobs />} />
                    <Route path="/company" element={<CompanyProfile />} />
                    <Route path="/candidates/:userId" element={<PublicCandidateProfile />} />
                </Route>

                {/* Candidate-only routes */}
                <Route element={<ProtectedRoute allowedRoles={['CANDIDATE']} />}>
                    <Route path="/jobs" element={<Jobs />} />
                    <Route path="/jobs/:id" element={<JobDetail />} />
                    <Route path="/company/:employerId" element={<PublicCompanyProfile />} />
                    <Route path="/my-applications" element={<MyApplications />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Route>
        </Routes>
    );
}

