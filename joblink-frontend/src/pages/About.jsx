import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function About() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="bg-[#f5f0eb] min-h-[calc(100vh-64px)]">
            <div className="max-w-4xl mx-auto px-6 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">About JobLink</h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        We're on a mission to connect talent with opportunity — making hiring simpler, faster, and more transparent for everyone.
                    </p>
                </div>

                {/* Story */}
                <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Story</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        JobLink was born from a simple observation: finding the right job — or the right candidate — shouldn't be so complicated. Traditional job boards are cluttered with noise, and the hiring process often feels like a black box for both sides.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        We built JobLink to change that. Our platform connects job seekers directly with employers through a clean, transparent process. No recruiter middlemen, no hidden algorithms — just real connections between real people.
                    </p>
                </div>

                {/* Values */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
                        <div className="text-3xl mb-3">🎯</div>
                        <h3 className="font-semibold text-gray-900 mb-2">Transparency</h3>
                        <p className="text-sm text-gray-500">Every application has a clear status. No ghosting, no guessing.</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
                        <div className="text-3xl mb-3">⚡</div>
                        <h3 className="font-semibold text-gray-900 mb-2">Speed</h3>
                        <p className="text-sm text-gray-500">Post a job in minutes. Apply in seconds. Hire in days, not months.</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
                        <div className="text-3xl mb-3">🤝</div>
                        <h3 className="font-semibold text-gray-900 mb-2">Trust</h3>
                        <p className="text-sm text-gray-500">Verified companies. Real candidates. No spam, no scams.</p>
                    </div>
                </div>

                {/* CTA — only shown when logged out */}
                {!isAuthenticated() && (
                    <div className="bg-white rounded-3xl shadow-sm p-8 text-center">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Ready to get started?</h2>
                        <p className="text-gray-500 mb-6">Join thousands of professionals already on JobLink.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                to="/register?role=CANDIDATE"
                                className="px-6 py-3 bg-[#b5621b] text-white rounded-full font-medium hover:bg-[#a0541a] transition"
                            >
                                👤 Looking for a job? Register as Candidate
                            </Link>
                            <Link
                                to="/register?role=EMPLOYER"
                                className="px-6 py-3 border border-gray-800 text-gray-800 rounded-full font-medium hover:bg-gray-800 hover:text-white transition"
                            >
                                🏢 Hiring? Register as Employer
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
