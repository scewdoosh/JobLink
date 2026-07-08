import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { CardSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

export default function MyApplications() {
    const { user } = useAuth();

    const [applications, setApplications] = useState([]);
    const [jobDetails, setJobDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchApplications = async () => {
            if (!user?.userId) return;
            try {
                const res = await API.get(`/api/applications/candidate/${user.userId}`);
                const apps = Array.isArray(res.data) ? res.data : [];
                // Sort by appliedAt descending
                apps.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

                // Fetch job details for each application
                const jobIds = [...new Set(apps.map(a => a.jobId).filter(Boolean))];
                const jobPromises = jobIds.map(async (jobId) => {
                    try {
                        const jobRes = await API.get(`/api/jobs/${jobId}`);
                        return { jobId, data: jobRes.data };
                    } catch {
                        return { jobId, data: null };
                    }
                });
                const jobResults = await Promise.all(jobPromises);
                const jobMap = {};
                jobResults.forEach(({ jobId, data }) => {
                    if (data) jobMap[jobId] = data;
                });
                setJobDetails(jobMap);

                // Filter out applications whose job was deleted (not in jobMap)
                const validApps = apps.filter(a => jobMap[a.jobId]);
                setApplications(validApps);
            } catch {
                setError('Failed to load your applications.');
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, [user]);

    return (
        <div className="bg-[#f5f0eb] min-h-[calc(100vh-64px)]">
            <div className="max-w-3xl mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">My Applications</h1>
                <p className="text-sm text-gray-500 mb-6">Track the status of your job applications</p>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
                    </div>
                ) : applications.length === 0 ? (
                    <EmptyState
                        icon="📋"
                        title="No applications yet"
                        subtitle="Start exploring jobs and apply to the ones that interest you"
                        action={
                            <Link
                                to="/jobs"
                                className="inline-block px-6 py-2.5 bg-[#b5621b] text-white rounded-xl text-sm font-medium hover:bg-[#a0541a] transition"
                            >
                                Browse Jobs
                            </Link>
                        }
                    />
                ) : (
                    <div className="space-y-3">
                        {applications.map(app => {
                            const job = jobDetails[app.jobId];
                            return (
                                <div
                                    key={app.id}
                                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            {job ? (
                                                <Link
                                                    to={`/jobs/${app.jobId}`}
                                                    className="text-base font-semibold text-gray-900 hover:text-[#b5621b] transition truncate block"
                                                >
                                                    {job.title}
                                                </Link>
                                            ) : (
                                                <p className="text-base font-semibold text-gray-900 truncate">
                                                    Job #{app.jobId?.slice(0, 8)}...
                                                </p>
                                            )}
                                            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-gray-500">
                                                {job?.companyName && <span>{job.companyName}</span>}
                                                {job?.location && (
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                                        </svg>
                                                        {job.location}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <StatusBadge status={app.status} />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-3">
                                        Applied {new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
