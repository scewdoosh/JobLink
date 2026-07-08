import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await API.post('/api/auth/login', form);
            // Pass user data to login(); AuthContext will decode JWT for userId
            login(
                { email: res.data.email, role: res.data.role, name: null },
                res.data.token
            );
            navigate('/');
        } catch (err) {
            setError(
                err.response?.data?.message || 'Invalid email or password'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#f5f0eb] flex items-center justify-center px-4 py-12">
            <div className="bg-white rounded-3xl shadow-sm p-10 w-full max-w-md">

                <Link to="/" className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 mb-8 transition">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Home
                </Link>

                <h1 className="text-2xl font-bold text-gray-900 text-center">Welcome Back</h1>
                <p className="text-sm text-gray-500 text-center mt-1">Login to your account</p>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#b5621b] focus:ring-1 focus:ring-[#b5621b]/20 transition"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#b5621b] focus:ring-1 focus:ring-[#b5621b]/20 transition"
                        />
                    </div>

                    <p className="text-sm text-[#b5621b] cursor-pointer hover:underline">
                        Forgot password?
                    </p>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[#b5621b] text-white rounded-xl font-medium hover:bg-[#a0541a] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Logging in...
                            </span>
                        ) : 'Login'}
                    </button>
                </form>

                <div className="mt-6">
                    <p className="text-center text-sm text-gray-400 mb-4">or continue with</p>
                    <div className="flex gap-3">
                        <a
                            href={`${import.meta.env.VITE_USER_SERVICE_URL}/oauth2/authorization/google`}
                            className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition"
                        >
                            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                            Google
                        </a>

                        <a
                            href={`${import.meta.env.VITE_USER_SERVICE_URL}/oauth2/authorization/github`}
                            className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                            GitHub
                        </a>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Don&apos;t have an account?{' '}
                    <Link to="/register" className="text-[#b5621b] hover:underline font-medium">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}