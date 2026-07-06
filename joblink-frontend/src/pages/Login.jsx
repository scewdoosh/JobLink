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
            login(
                { email: res.data.email, role: res.data.role },
                res.data.token
            );
            navigate(res.data.role === 'EMPLOYER' ? '/my-jobs' : '/jobs');
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f0eb] flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-sm p-10 w-full max-w-md">

                <Link to="/" className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 mb-8">
                    ← Back to Home
                </Link>

                <h2 className="text-2xl font-bold text-gray-900 text-center">Welcome Back</h2>
                <p className="text-sm text-gray-500 text-center mt-1">Login to your account</p>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <label className="text-sm text-gray-600">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#b5621b] transition"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#b5621b] transition"
                        />
                    </div>

                    <p className="text-sm text-[#b5621b] cursor-pointer hover:underline">
                        Forgot password?
                    </p>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[#b5621b] text-white rounded-xl font-medium hover:bg-[#a0541a] transition disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
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
                            <span>🐙</span>
                            GitHub
                        </a>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-[#b5621b] hover:underline font-medium">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}