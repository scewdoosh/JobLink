import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import { DetailSkeleton } from '../components/LoadingSkeleton';
import CandidateAvatar from '../components/CandidateAvatar';

export default function PublicCandidateProfile() {
    const { userId } = useParams();
    const [profile, setProfile] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                // Fetch profile and user data in parallel
                const [profileRes, userRes] = await Promise.all([
                    API.get(`/api/profiles/${userId}`),
                    API.get(`/api/users/${userId}`)
                ]);
                setProfile(profileRes.data);
                setUser(userRes.data);
            } catch (err) {
                setError('Candidate not found or failed to load.');
            } finally {
                setLoading(false);
            }
        };
        fetchCandidate();
    }, [userId]);

    if (loading) {
        return (
            <div className="bg-[#f5f0eb] min-h-[calc(100vh-64px)]">
                <div className="max-w-3xl mx-auto px-6 py-8">
                    <DetailSkeleton />
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="bg-[#f5f0eb] min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-6xl mb-4">👤</p>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{error || 'Candidate not found'}</h2>
                    <button onClick={() => window.history.back()} className="text-[#b5621b] hover:underline text-sm font-medium">
                        ← Go Back
                    </button>
                </div>
            </div>
        );
    }

    const displayName = user?.name || 'Candidate';

    const handleDownloadResume = async () => {
        try {
            const res = await API.get(`/api/profiles/${userId}/resume`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', profile.resumeFileName || 'resume.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Failed to download resume', err);
            alert('Failed to download resume. It may not exist.');
        }
    };

    return (
        <div className="bg-[#f5f0eb] min-h-[calc(100vh-64px)]">
            <div className="max-w-3xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => window.history.back()} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 transition">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Go Back
                    </button>
                    {profile.resumeFileName && (
                        <button
                            onClick={handleDownloadResume}
                            className="px-4 py-2 bg-gray-800 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            Download Resume
                        </button>
                    )}
                </div>

                <div className="space-y-6">
                    {/* Header Card */}
                    <div className="bg-white rounded-3xl shadow-sm p-8">
                        <div className="flex items-start gap-6">
                            <CandidateAvatar userId={userId} name={displayName} className="w-20 h-20 text-3xl" />
                            <div className="pt-1">
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">{displayName}</h1>
                                {user?.email && (
                                    <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                        {user.email}
                                    </p>
                                )}
                                {profile.location && (
                                    <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                        </svg>
                                        {profile.location}
                                    </p>
                                )}
                            </div>
                        </div>

                        {profile.bio && (
                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
                            </div>
                        )}

                        {profile.skills && (
                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills.split(',').map((skill, i) => (
                                        <span key={i} className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-sm border border-gray-100">
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Experience Section */}
                    {profile.experiences && profile.experiences.length > 0 && (
                        <div className="bg-white rounded-3xl shadow-sm p-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Experience</h2>
                            <div className="space-y-6">
                                {profile.experiences.map((exp, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center shrink-0 mt-1">
                                            🏢
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{exp.role}</h3>
                                            <p className="text-sm text-[#b5621b] font-medium">{exp.company}</p>
                                            <p className="text-xs text-gray-500 mt-1 mb-2">
                                                {exp.startDate} – {exp.endDate || 'Present'}
                                            </p>
                                            {exp.description && (
                                                <p className="text-sm text-gray-600">{exp.description}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education Section */}
                    {profile.educations && profile.educations.length > 0 && (
                        <div className="bg-white rounded-3xl shadow-sm p-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Education</h2>
                            <div className="space-y-6">
                                {profile.educations.map((edu, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center shrink-0 mt-1">
                                            🎓
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                                            <p className="text-sm text-[#b5621b] font-medium">{edu.institution}</p>
                                            {edu.year && <p className="text-xs text-gray-500 mt-1">{edu.year}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
