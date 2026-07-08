import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { CardSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { useToast } from '../components/Toast';
import CandidateAvatar from '../components/CandidateAvatar';

const APPLICATION_STATUSES = ['APPLIED', 'SHORTLISTED', 'REJECTED', 'HIRED'];

export default function MyJobs() {
    const { user } = useAuth();
    const { addToast } = useToast();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedJob, setExpandedJob] = useState(null);
    const [applicants, setApplicants] = useState({});
    const [loadingApplicants, setLoadingApplicants] = useState({});
    const [actionLoading, setActionLoading] = useState({});
    const [candidateInfo, setCandidateInfo] = useState({});

    const fetchJobs = useCallback(async () => {
        if (!user?.userId) return;
        setLoading(true);
        try {
            const res = await API.get(`/api/jobs/employer/${user.userId}`);
            setJobs(Array.isArray(res.data) ? res.data : []);
        } catch {
            setError('Failed to load your jobs.');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    // Fetch candidate user info for a list of candidateIds (batched via Promise.all)
    const fetchCandidateInfoBatch = async (candidateIds) => {
        // Filter out IDs we already have cached
        const idsToFetch = candidateIds.filter(id => id && !candidateInfo[id]);
        if (idsToFetch.length === 0) return;

        const results = await Promise.all(
            idsToFetch.map(async (id) => {
                try {
                    const res = await API.get(`/api/users/${id}`);
                    return { id, data: res.data };
                } catch {
                    return { id, data: null };
                }
            })
        );

        const newInfo = {};
        results.forEach(({ id, data }) => {
            if (data) newInfo[id] = data;
        });

        if (Object.keys(newInfo).length > 0) {
            setCandidateInfo(prev => ({ ...prev, ...newInfo }));
        }
    };

    // Always re-fetch applicants when expanding (fixes stale data / toggle bug)
    const fetchApplicants = async (jobId) => {
        setLoadingApplicants(prev => ({ ...prev, [jobId]: true }));
        try {
            const res = await API.get(`/api/applications/job/${jobId}`);
            const apps = Array.isArray(res.data) ? res.data : [];
            setApplicants(prev => ({ ...prev, [jobId]: apps }));

            // Batch-fetch candidate info for all applicants
            const candidateIds = apps.map(a => a.candidateId).filter(Boolean);
            fetchCandidateInfoBatch(candidateIds);
        } catch {
            addToast('Failed to load applicants.', 'error');
        } finally {
            setLoadingApplicants(prev => ({ ...prev, [jobId]: false }));
        }
    };

    const toggleApplicants = (jobId) => {
        if (expandedJob === jobId) {
            setExpandedJob(null);
        } else {
            setExpandedJob(jobId);
            // Always re-fetch — no early return for cached data
            fetchApplicants(jobId);
        }
    };

    const handleCloseJob = async (jobId) => {
        setActionLoading(prev => ({ ...prev, [`close-${jobId}`]: true }));
        try {
            await API.patch(`/api/jobs/${jobId}/close`);
            setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'CLOSED' } : j));
            addToast('Job closed successfully.');
        } catch {
            addToast('Failed to close job.', 'error');
        } finally {
            setActionLoading(prev => ({ ...prev, [`close-${jobId}`]: false }));
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm('Are you sure you want to delete this job posting?')) return;
        setActionLoading(prev => ({ ...prev, [`delete-${jobId}`]: true }));
        try {
            await API.delete(`/api/jobs/${jobId}`);
            setJobs(prev => prev.filter(j => j.id !== jobId));
            addToast('Job deleted successfully.');
        } catch {
            addToast('Failed to delete job.', 'error');
        } finally {
            setActionLoading(prev => ({ ...prev, [`delete-${jobId}`]: false }));
        }
    };

    const handleStatusChange = async (applicationId, newStatus, jobId) => {
        setActionLoading(prev => ({ ...prev, [`status-${applicationId}`]: true }));
        try {
            await API.patch(`/api/applications/${applicationId}/status?status=${newStatus}`);
            setApplicants(prev => ({
                ...prev,
                [jobId]: prev[jobId].map(a =>
                    a.id === applicationId ? { ...a, status: newStatus } : a
                ),
            }));
            addToast(`Applicant status updated to ${newStatus}.`);
        } catch {
            addToast('Failed to update applicant status.', 'error');
        } finally {
            setActionLoading(prev => ({ ...prev, [`status-${applicationId}`]: false }));
        }
    };

    return (
        <div className="bg-[#f5f0eb] min-h-[calc(100vh-64px)]">
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Job Postings</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage your posted jobs and review applicants</p>
                    </div>
                    <Link
                        to="/post-job"
                        className="px-5 py-2.5 bg-[#b5621b] text-white rounded-xl text-sm font-medium hover:bg-[#a0541a] transition flex items-center gap-1.5"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Post New Job
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
                    </div>
                ) : jobs.length === 0 ? (
                    <EmptyState
                        icon="📝"
                        title="No jobs posted yet"
                        subtitle="Create your first job posting to start receiving applications"
                        action={
                            <Link
                                to="/post-job"
                                className="inline-block px-6 py-2.5 bg-[#b5621b] text-white rounded-xl text-sm font-medium hover:bg-[#a0541a] transition"
                            >
                                Post Your First Job
                            </Link>
                        }
                    />
                ) : (
                    <div className="space-y-4">
                        {jobs.map(job => (
                            <div key={job.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                {/* Job Header */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-lg font-semibold text-gray-900 truncate">{job.title}</h3>
                                                <StatusBadge status={job.status} />
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                                {job.location && <span>📍 {job.location}</span>}
                                                {job.deadline && (
                                                    <span>
                                                        📅 {new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                )}
                                                {job.createdAt && (
                                                    <span className="text-gray-400">
                                                        Posted {new Date(job.createdAt).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap items-center gap-2 mt-4">
                                        <button
                                            onClick={() => toggleApplicants(job.id)}
                                            className="px-3.5 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
                                        >
                                            {expandedJob === job.id ? 'Hide' : 'View'} Applicants
                                        </button>
                                        <Link
                                            to={`/post-job?edit=${job.id}`}
                                            className="px-3.5 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
                                        >
                                            Edit
                                        </Link>
                                        {job.status === 'OPEN' && (
                                            <button
                                                onClick={() => handleCloseJob(job.id)}
                                                disabled={actionLoading[`close-${job.id}`]}
                                                className="px-3.5 py-1.5 text-sm border border-amber-200 text-amber-700 rounded-lg hover:bg-amber-50 transition font-medium disabled:opacity-50"
                                            >
                                                {actionLoading[`close-${job.id}`] ? 'Closing...' : 'Close'}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteJob(job.id)}
                                            disabled={actionLoading[`delete-${job.id}`]}
                                            className="px-3.5 py-1.5 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition font-medium disabled:opacity-50"
                                        >
                                            {actionLoading[`delete-${job.id}`] ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </div>

                                {/* Applicants Panel */}
                                {expandedJob === job.id && (
                                    <div className="border-t border-gray-100 bg-gray-50/50 p-6">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Applicants</h4>
                                        {loadingApplicants[job.id] ? (
                                            <div className="flex items-center gap-2 text-sm text-gray-500 py-4">
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Loading applicants...
                                            </div>
                                        ) : !applicants[job.id] || applicants[job.id].length === 0 ? (
                                            <p className="text-sm text-gray-500 py-4">No applicants yet.</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {applicants[job.id].map(app => {
                                                    const candidate = candidateInfo[app.candidateId];
                                                    const displayName = candidate?.name || 'Candidate';
                                                    const initial = displayName.charAt(0).toUpperCase();

                                                    return (
                                                        <div
                                                            key={app.id}
                                                            className="flex items-center justify-between gap-4 bg-white rounded-xl p-4 border border-gray-100"
                                                        >
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <CandidateAvatar userId={app.candidateId} name={displayName} className="w-9 h-9 text-sm" />
                                                                <div className="min-w-0">
                                                                    <Link to={`/candidates/${app.candidateId}`} className="text-sm font-medium text-gray-800 truncate hover:text-[#b5621b] hover:underline transition">
                                                                        {displayName}
                                                                    </Link>
                                                                    {app.status === 'HIRED' && candidate?.email && (
                                                                        <p className="text-xs text-green-600 truncate">
                                                                            Hired — contact: {candidate.email}
                                                                        </p>
                                                                    )}
                                                                    <p className="text-xs text-gray-400">
                                                                        Applied {new Date(app.appliedAt).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 shrink-0">
                                                                <StatusBadge status={app.status} />
                                                                <select
                                                                    value={app.status}
                                                                    onChange={(e) => handleStatusChange(app.id, e.target.value, job.id)}
                                                                    disabled={actionLoading[`status-${app.id}`]}
                                                                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#b5621b] disabled:opacity-50"
                                                                >
                                                                    {APPLICATION_STATUSES.map(s => (
                                                                        <option key={s} value={s}>{s}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
