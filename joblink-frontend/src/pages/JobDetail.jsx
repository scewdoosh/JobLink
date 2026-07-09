import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompletion } from '../context/CompletionContext';
import API from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { DetailSkeleton } from '../components/LoadingSkeleton';
import { useToast } from '../components/Toast';

export default function JobDetail() {
    const { id } = useParams();
    const { user, isAuthenticated, isCandidate } = useAuth();
    const { profileComplete } = useCompletion();
    const { addToast } = useToast();

    const [job, setJob] = useState(null);
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [applying, setApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [checkingApplication, setCheckingApplication] = useState(false);

    // Fetch job details
    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await API.get(`/api/jobs/${id}`);
                setJob(res.data);
                
                if (res.data.companyId) {
                    try {
                        const companyRes = await API.get(`/api/companies/${res.data.companyId}`);
                        setCompany(companyRes.data);
                    } catch (err) {
                        console.error('Failed to load company details', err);
                    }
                }
            } catch {
                setError('Failed to load job details.');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    // Check if candidate already applied
    useEffect(() => {
        const checkApplication = async () => {
            if (!isAuthenticated() || !isCandidate() || !user?.userId) return;
            setCheckingApplication(true);
            try {
                const res = await API.get(`/api/applications/candidate/${user.userId}`);
                const applications = Array.isArray(res.data) ? res.data : [];
                setHasApplied(applications.some(app => app.jobId === id));
            } catch {
                // Silently fail — just don't show "applied" state
            } finally {
                setCheckingApplication(false);
            }
        };
        checkApplication();
    }, [id, user, isAuthenticated, isCandidate]);

    const handleApply = async () => {
        if (!user?.userId) return;
        setApplying(true);
        try {
            await API.post('/api/applications', {
                candidateId: user.userId,
                jobId: id,
            });
            setHasApplied(true);
            addToast('Application submitted successfully!');
        } catch (err) {
            addToast(err.response?.data?.message || 'Failed to submit application.', 'error');
        } finally {
            setApplying(false);
        }
    };

    const skills = job?.skillsRequired
        ? (Array.isArray(job.skillsRequired) ? job.skillsRequired : job.skillsRequired.split(',').map(s => s.trim()))
        : [];

    if (loading) {
        return (
            <div className="bg-[#f5f0eb] min-h-[calc(100vh-64px)]">
                <div className="max-w-3xl mx-auto px-6 py-8">
                    <DetailSkeleton />
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="bg-[#f5f0eb] min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-6xl mb-4">😕</p>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{error || 'Job not found'}</h2>
                    <Link to="/jobs" className="text-[#b5621b] hover:underline text-sm font-medium">
                        ← Back to Jobs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f5f0eb] min-h-[calc(100vh-64px)]">
            <div className="max-w-3xl mx-auto px-6 py-8">
                <Link to="/jobs" className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 mb-6 transition">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Jobs
                </Link>

                <div className="bg-white rounded-3xl shadow-sm p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                            {company?.name && (
                                <Link to={`/company/${job.employerId}`} className="text-gray-500 mt-1 hover:text-[#b5621b] hover:underline transition">
                                    {company.name}
                                </Link>
                            )}
                        </div>
                        <StatusBadge status={job.status} />
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                        {job.location && (
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                                {job.location}
                            </span>
                        )}
                        {(job.salaryMin || job.salaryMax) && (
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {job.salaryMin && job.salaryMax
                                    ? `$${job.salaryMin.toLocaleString()} – $${job.salaryMax.toLocaleString()}`
                                    : job.salaryMin
                                        ? `From $${job.salaryMin.toLocaleString()}`
                                        : `Up to $${job.salaryMax.toLocaleString()}`
                                }
                            </span>
                        )}
                        {job.category && (
                            <span className="bg-[#f5f0eb] text-[#b5621b] px-2.5 py-0.5 rounded-full text-xs font-medium">
                                {job.category}
                            </span>
                        )}
                        {job.createdAt && (
                            <span className="text-gray-400">
                                Posted {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h2>
                        <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {job.description}
                        </div>
                    </div>

                    {/* Skills */}
                    {skills.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Skills Required</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-sm border border-gray-100"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Deadline */}
                    {job.deadline && (
                        <div className="mb-8 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                            <p className="text-sm text-amber-800 font-medium">
                                ⏰ Application deadline: {new Date(job.deadline).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                    )}

                    {/* Company Details */}
                    {company && (
                        <div className="mb-8 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                                </svg>
                                About {company.name}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {company.industry && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Industry</p>
                                        <p className="text-sm font-medium text-gray-800">{company.industry}</p>
                                    </div>
                                )}
                                {company.size && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Company Size</p>
                                        <p className="text-sm font-medium text-gray-800">{company.size}</p>
                                    </div>
                                )}
                                {company.website && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Website</p>
                                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#b5621b] hover:underline flex items-center gap-1 mt-0.5">
                                            {company.website.replace(/^https?:\/\//, '')}
                                        </a>
                                    </div>
                                )}
                                {company.location && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Location</p>
                                        <p className="text-sm font-medium text-gray-800">{company.location}</p>
                                    </div>
                                )}
                            </div>
                            {company.description && (
                                <div>
                                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{company.description}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Apply Button */}
                    {isAuthenticated() && isCandidate() && job.status === 'OPEN' && (
                        <div className="pt-4 border-t border-gray-100">
                            {hasApplied ? (
                                <div className="flex items-center gap-2 text-emerald-600 font-medium">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    You have already applied to this job
                                </div>
                            ) : !profileComplete ? (
                                <button
                                    disabled
                                    className="w-full py-3.5 bg-gray-300 text-gray-500 rounded-xl font-medium cursor-not-allowed transition"
                                    title="Complete your profile before applying"
                                >
                                    Complete your profile before applying
                                </button>
                            ) : (
                                <button
                                    onClick={handleApply}
                                    disabled={applying || checkingApplication}
                                    className="w-full py-3.5 bg-[#b5621b] text-white rounded-xl font-medium hover:bg-[#a0541a] transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {applying ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Submitting...
                                        </span>
                                    ) : 'Apply Now'}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Not logged in prompt */}
                    {!isAuthenticated() && job.status === 'OPEN' && (
                        <div className="pt-4 border-t border-gray-100">
                            <Link
                                to="/login"
                                className="block w-full py-3.5 bg-[#b5621b] text-white rounded-xl font-medium hover:bg-[#a0541a] transition text-center"
                            >
                                Login to Apply
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
