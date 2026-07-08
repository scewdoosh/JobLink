import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

export default function JobCard({ job }) {
    const salaryDisplay = () => {
        if (job.salaryMin && job.salaryMax) {
            return `$${job.salaryMin.toLocaleString()} – $${job.salaryMax.toLocaleString()}`;
        }
        if (job.salaryMin) return `From $${job.salaryMin.toLocaleString()}`;
        if (job.salaryMax) return `Up to $${job.salaryMax.toLocaleString()}`;
        return null;
    };

    const skills = job.skillsRequired
        ? (Array.isArray(job.skillsRequired) ? job.skillsRequired : job.skillsRequired.split(',').map(s => s.trim()))
        : [];

    return (
        <Link
            to={`/jobs/${job.id}`}
            className="block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#b5621b] transition-colors truncate">
                        {job.title}
                    </h3>
                    {job.companyName && (
                        <p className="text-sm text-gray-500 mt-0.5">{job.companyName}</p>
                    )}
                </div>
                {job.status && <StatusBadge status={job.status} />}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
                {job.location && (
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        {job.location}
                    </span>
                )}
                {salaryDisplay() && (
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {salaryDisplay()}
                    </span>
                )}
                {job.category && (
                    <span className="bg-[#f5f0eb] text-[#b5621b] px-2 py-0.5 rounded-full text-xs font-medium">
                        {job.category}
                    </span>
                )}
            </div>

            {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {skills.slice(0, 5).map((skill, i) => (
                        <span
                            key={i}
                            className="bg-gray-50 text-gray-600 px-2.5 py-1 rounded-lg text-xs border border-gray-100"
                        >
                            {skill}
                        </span>
                    ))}
                    {skills.length > 5 && (
                        <span className="text-gray-400 text-xs px-2 py-1">+{skills.length - 5} more</span>
                    )}
                </div>
            )}

            {job.deadline && (
                <p className="text-xs text-gray-400 mt-3">
                    Deadline: {new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
            )}
        </Link>
    );
}
