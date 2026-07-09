import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompletion } from '../context/CompletionContext';

import CandidateAvatar from './CandidateAvatar';

export default function Navbar() {
    const { isAuthenticated, isEmployer, isCandidate, logout, user } = useAuth();
    const { profileComplete, companyComplete } = useCompletion();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Build nav links from a single source of truth
    const getNavLinks = () => {
        if (!isAuthenticated()) {
            // Logged-out: Home, About Us, Contact only
            return [
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
            ];
        }

        if (isCandidate()) {
            return [
                { to: '/', label: 'Home' },
                { to: '/jobs', label: 'Find Jobs' },
                { to: '/my-applications', label: 'My Applications' },
                { to: '/profile', label: 'Profile' },
            ];
        }

        if (isEmployer()) {
            return [
                { to: '/', label: 'Home' },
                { to: '/post-job', label: 'Post Job' },
                { to: '/my-jobs', label: 'My Jobs' },
                { to: '/company', label: 'Company Profile' },
            ];
        }

        // Fallback for any other authenticated role
        return [{ to: '/', label: 'Home' }];
    };

    const navLinks = getNavLinks();

    return (
        <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
            {/* Logo */}
            <Link to="/" className="text-xl font-bold text-gray-900">
                JobLink
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
                {navLinks.map(link => (
                    <Link key={link.to} to={link.to} className="hover:text-gray-900 transition">
                        {link.label}
                    </Link>
                ))}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
                {!isAuthenticated() ? (
                    <div className="flex items-center gap-3">
                        <Link
                            to="/login"
                            className="px-4 py-2 text-sm text-gray-800 hover:text-gray-900 transition font-medium"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="px-4 py-2 text-sm border border-gray-800 rounded-full text-gray-800 hover:bg-gray-800 hover:text-white transition"
                        >
                            Register
                        </Link>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link to={isCandidate() ? '/profile' : '/company'} className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded-full transition cursor-pointer">
                            <CandidateAvatar userId={user?.userId} name={user?.name || user?.email} className="w-8 h-8 text-sm" />
                            <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name || user?.email}</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm border border-gray-800 rounded-full text-gray-800 hover:bg-gray-800 hover:text-white transition"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}