import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
    const { isAuthenticated, isEmployer, isCandidate } = useAuth();

    // Determine CTA destinations based on auth state
    const findJobsLink = isAuthenticated() ? '/jobs' : '/login';
    const postJobLink = isAuthenticated() ? '/post-job' : '/login';

    const showFindJobs = !isAuthenticated() || isCandidate();
    const showPostJob = !isAuthenticated() || isEmployer();

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#f5f0eb]">

            {/* Hero Section */}
            <div className="max-w-6xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Left */}
                <div>
                    <h1 className="text-6xl font-bold text-gray-900 leading-tight">
                        Connect.<br />
                        Apply. <span className="text-[#b5621b]">Hire.</span>
                    </h1>
                    <p className="mt-6 text-gray-500 text-lg max-w-md">
                        JobLink is your all-in-one platform to connect talent with opportunities and build the future of work.
                    </p>
                    <div className="mt-8 flex gap-4">
                        {showFindJobs && (
                            <Link
                                to={findJobsLink}
                                className="px-6 py-3 bg-[#b5621b] text-white rounded-full font-medium hover:bg-[#a0541a] transition"
                            >
                                Find Jobs
                            </Link>
                        )}
                        {showPostJob && (
                            <Link
                                to={postJobLink}
                                className={`px-6 py-3 rounded-full font-medium transition ${
                                    showFindJobs
                                        ? 'border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'
                                        : 'bg-[#b5621b] text-white hover:bg-[#a0541a]'
                                }`}
                            >
                                Post a Job
                            </Link>
                        )}
                    </div>

                    {/* Feature Cards */}
                    <div className="mt-12 grid grid-cols-3 gap-4">
                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                            <div className="text-2xl mb-2">👤</div>
                            <p className="text-sm font-semibold text-gray-800">For Job Seekers</p>
                            <p className="text-xs text-gray-500 mt-1">Find the right opportunity</p>
                        </div>
                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                            <div className="text-2xl mb-2">🏢</div>
                            <p className="text-sm font-semibold text-gray-800">For Employers</p>
                            <p className="text-xs text-gray-500 mt-1">Hire the best talent</p>
                        </div>
                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                            <div className="text-2xl mb-2">✅</div>
                            <p className="text-sm font-semibold text-gray-800">Trusted Platform</p>
                            <p className="text-xs text-gray-500 mt-1">Secure. Verified. Reliable.</p>
                        </div>
                    </div>
                </div>

                {/* Right - Image Placeholder */}
                <div className="hidden md:block">
                    <div className="bg-white rounded-3xl h-96 shadow-sm flex items-center justify-center">
                        <div className="text-center text-gray-400">
                            <div className="text-6xl mb-4">💼</div>
                            <p className="text-sm">Your dream job awaits</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-6xl mx-auto px-8 pb-20">
                <div className="bg-white rounded-3xl p-8 shadow-sm grid grid-cols-3 divide-x divide-gray-100">
                    <div className="text-center px-8">
                        <p className="text-3xl font-bold text-gray-900">10K+</p>
                        <p className="text-sm text-gray-500 mt-1">Active Jobs</p>
                    </div>
                    <div className="text-center px-8">
                        <p className="text-3xl font-bold text-gray-900">5K+</p>
                        <p className="text-sm text-gray-500 mt-1">Companies</p>
                    </div>
                    <div className="text-center px-8">
                        <p className="text-3xl font-bold text-gray-900">25K+</p>
                        <p className="text-sm text-gray-500 mt-1">Users Hired</p>
                    </div>
                </div>
            </div>

        </div>
    );
}