import { Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CompletionProvider } from './context/CompletionContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileGate from './components/ProfileGate';
import CompanyGate from './components/CompanyGate';

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
                                <Route path="/company-profile" element={<CompanyProfile />} />
                                <Route element={<CompanyGate />}>
                                    <Route path="/post-job" element={<PostJob />} />
                                    <Route path="/my-jobs" element={<MyJobs />} />
                                    <Route path="/company" element={<CompanyProfile />} />
                                    <Route path="/candidates/:userId" element={<PublicCandidateProfile />} />
                                </Route>
                            </Route>

                            {/* Candidate-only routes */}
                            <Route element={<ProtectedRoute allowedRoles={['CANDIDATE']} />}>
                                <Route path="/complete-profile" element={<Profile />} />
                                <Route element={<ProfileGate />}>
                                    <Route path="/jobs" element={<Jobs />} />
                                    <Route path="/jobs/:id" element={<JobDetail />} />
                                    <Route path="/company/:employerId" element={<PublicCompanyProfile />} />
                                    <Route path="/my-applications" element={<MyApplications />} />
                                    <Route path="/profile" element={<Profile />} />
                                </Route>
                            </Route>
                        </Route>
                    </Routes>
                </ToastProvider>
            </CompletionProvider>
        </AuthProvider>
    );
}

