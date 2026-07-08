import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const ROLES = ['CANDIDATE', 'EMPLOYER'];

export default function Register() {
    const [searchParams] = useSearchParams();
    const initialRole = ROLES.includes(searchParams.get('role')) ? searchParams.get('role') : 'CANDIDATE';

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: initialRole,
    });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        // Clear field error on change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Name is required';
        if (!form.email.trim()) errs.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format';
        if (!form.password) errs.password = 'Password is required';
        else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
        if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        setLoading(true);
        setApiError('');
        try {
            // 1. Register
            const registerRes = await API.post('/api/auth/register', {
                name: form.name,
                email: form.email,
                password: form.password,
                role: form.role,
            });

            // 2. Auto-login to get JWT
            const loginRes = await API.post('/api/auth/login', {
                email: form.email,
                password: form.password,
            });

            // 3. Call context login — JWT will be decoded for userId
            login(
                {
                    email: loginRes.data.email,
                    role: loginRes.data.role,
                    name: registerRes.data.name || form.name,
                    userId: registerRes.data.id,
                },
                loginRes.data.token
            );

            // The redirect to /complete-profile will be handled by the ProfileGate/CompanyGate
            navigate('/');
        } catch (err) {
            setApiError(
                err.response?.data?.message || 'Registration failed. Please try again.'
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

                <h1 className="text-2xl font-bold text-gray-900 text-center">Create Account</h1>
                <p className="text-sm text-gray-500 text-center mt-1">Join JobLink today</p>

                {apiError && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        {apiError}
                    </div>
                )}

                {/* Role Toggle */}
                <div className="mt-6 flex bg-gray-100 rounded-xl p-1">
                    {ROLES.map(role => (
                        <button
                            key={role}
                            type="button"
                            onClick={() => setForm(prev => ({ ...prev, role }))}
                            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                form.role === role
                                    ? 'bg-[#b5621b] text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {role === 'CANDIDATE' ? '👤 Job Seeker' : '🏢 Employer'}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-600">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={handleChange}
                            className={`mt-1 w-full px-4 py-3 border rounded-xl text-sm focus:outline-none transition ${
                                errors.name
                                    ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-200'
                                    : 'border-gray-200 focus:border-[#b5621b] focus:ring-1 focus:ring-[#b5621b]/20'
                            }`}
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            className={`mt-1 w-full px-4 py-3 border rounded-xl text-sm focus:outline-none transition ${
                                errors.email
                                    ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-200'
                                    : 'border-gray-200 focus:border-[#b5621b] focus:ring-1 focus:ring-[#b5621b]/20'
                            }`}
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            className={`mt-1 w-full px-4 py-3 border rounded-xl text-sm focus:outline-none transition ${
                                errors.password
                                    ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-200'
                                    : 'border-gray-200 focus:border-[#b5621b] focus:ring-1 focus:ring-[#b5621b]/20'
                            }`}
                        />
                        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className={`mt-1 w-full px-4 py-3 border rounded-xl text-sm focus:outline-none transition ${
                                errors.confirmPassword
                                    ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-200'
                                    : 'border-gray-200 focus:border-[#b5621b] focus:ring-1 focus:ring-[#b5621b]/20'
                            }`}
                        />
                        {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[#b5621b] text-white rounded-xl font-medium hover:bg-[#a0541a] transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Creating account...
                            </span>
                        ) : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#b5621b] hover:underline font-medium">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
