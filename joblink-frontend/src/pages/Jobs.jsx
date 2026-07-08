import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import JobCard from '../components/JobCard';
import { CardSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { Link } from 'react-router-dom';

export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({ keyword: '', location: '', skill: '' });
    const [appliedFilters, setAppliedFilters] = useState({ keyword: '', location: '', skill: '' });

    const fetchJobs = useCallback(async (searchFilters) => {
        setLoading(true);
        setError('');
        try {
            const hasFilters = searchFilters.keyword || searchFilters.location || searchFilters.skill;
            let res;
            if (hasFilters) {
                const params = new URLSearchParams();
                if (searchFilters.keyword) params.append('keyword', searchFilters.keyword);
                if (searchFilters.location) params.append('location', searchFilters.location);
                if (searchFilters.skill) params.append('skill', searchFilters.skill);
                res = await API.get(`/api/jobs/search?${params.toString()}`);
            } else {
                res = await API.get('/api/jobs');
            }
            setJobs(Array.isArray(res.data) ? res.data : []);
        } catch {
            setError('Failed to load jobs. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchJobs(appliedFilters);
    }, [appliedFilters, fetchJobs]);

    const handleSearch = (e) => {
        e.preventDefault();
        setAppliedFilters({ ...filters });
    };

    const clearFilters = () => {
        const empty = { keyword: '', location: '', skill: '' };
        setFilters(empty);
        setAppliedFilters(empty);
    };

    const hasActiveFilters = appliedFilters.keyword || appliedFilters.location || appliedFilters.skill;

    return (
        <div className="bg-[#f5f0eb] min-h-[calc(100vh-64px)]">
            {/* Search Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Find Your Next Opportunity</h1>
                    <p className="text-gray-500 mb-6">Browse thousands of jobs from top companies</p>

                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1 relative">
                            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Job title, keyword, or company..."
                                value={filters.keyword}
                                onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#b5621b] focus:ring-1 focus:ring-[#b5621b]/20 transition"
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Location"
                            value={filters.location}
                            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                            className="md:w-44 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#b5621b] focus:ring-1 focus:ring-[#b5621b]/20 transition"
                        />
                        <input
                            type="text"
                            placeholder="Skill"
                            value={filters.skill}
                            onChange={(e) => setFilters(prev => ({ ...prev, skill: e.target.value }))}
                            className="md:w-36 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#b5621b] focus:ring-1 focus:ring-[#b5621b]/20 transition"
                        />
                        <button
                            type="submit"
                            className="px-8 py-3 bg-[#b5621b] text-white rounded-xl font-medium hover:bg-[#a0541a] transition whitespace-nowrap"
                        >
                            Search
                        </button>
                    </form>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="mt-3 text-sm text-[#b5621b] hover:underline"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            </div>

            {/* Results */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
                    </div>
                ) : jobs.length === 0 ? (
                    <EmptyState
                        icon="🔍"
                        title="No jobs found"
                        subtitle={hasActiveFilters
                            ? "Try adjusting your search filters"
                            : "Check back later for new job postings"
                        }
                        action={hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="px-6 py-2.5 bg-[#b5621b] text-white rounded-xl text-sm font-medium hover:bg-[#a0541a] transition"
                            >
                                Clear Filters
                            </button>
                        )}
                    />
                ) : (
                    <>
                        <p className="text-sm text-gray-500 mb-5">
                            {jobs.length} job{jobs.length !== 1 && 's'} found
                            {hasActiveFilters && ' matching your search'}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {jobs.map(job => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
