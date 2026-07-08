import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import { DetailSkeleton } from '../components/LoadingSkeleton';

export default function PublicCompanyProfile() {
    const { employerId } = useParams();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await API.get(`/api/companies/employer/${employerId}`);
                setCompany(res.data);
            } catch (err) {
                setError('Company not found or failed to load.');
            } finally {
                setLoading(false);
            }
        };
        fetchCompany();
    }, [employerId]);

    if (loading) {
        return (
            <div className="bg-[#f5f0eb] min-h-[calc(100vh-64px)]">
                <div className="max-w-3xl mx-auto px-6 py-8">
                    <DetailSkeleton />
                </div>
            </div>
        );
    }

    if (error || !company) {
        return (
            <div className="bg-[#f5f0eb] min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-6xl mb-4">🏢</p>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{error || 'Company not found'}</h2>
                    <button onClick={() => window.history.back()} className="text-[#b5621b] hover:underline text-sm font-medium">
                        ← Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f5f0eb] min-h-[calc(100vh-64px)]">
            <div className="max-w-3xl mx-auto px-6 py-8">
                <button onClick={() => window.history.back()} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 mb-6 transition">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Go Back
                </button>

                <div className="bg-white rounded-3xl shadow-sm p-8">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                                {company.verified && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Verified
                                    </span>
                                )}
                            </div>
                            {company.industry && (
                                <p className="text-sm text-[#b5621b] font-medium mt-1">{company.industry}</p>
                            )}
                        </div>
                        {company.logoUrl && (
                            <img src={company.logoUrl} alt={company.name} className="w-20 h-20 rounded-2xl object-cover shadow-sm border border-gray-100" />
                        )}
                    </div>

                    {company.description && (
                        <div className="mb-8 pb-8 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">About Us</h2>
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{company.description}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {company.location && (
                            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">Headquarters</p>
                                <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                    </svg>
                                    {company.location}
                                </p>
                            </div>
                        )}
                        {company.website && (
                            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">Website</p>
                                <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-[#b5621b] hover:underline flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                    </svg>
                                    {company.website.replace(/^https?:\/\//, '')}
                                </a>
                            </div>
                        )}
                        {company.size && (
                            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">Company Size</p>
                                <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                    </svg>
                                    {company.size}
                                </p>
                            </div>
                        )}
                        {company.createdAt && (
                            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">Joined JobLink</p>
                                <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                    </svg>
                                    {new Date(company.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
