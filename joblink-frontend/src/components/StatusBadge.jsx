const STATUS_STYLES = {
    OPEN: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CLOSED: 'bg-gray-50 text-gray-600 border-gray-200',
    EXPIRED: 'bg-red-50 text-red-600 border-red-200',
    APPLIED: 'bg-blue-50 text-blue-700 border-blue-200',
    SHORTLISTED: 'bg-amber-50 text-amber-700 border-amber-200',
    REJECTED: 'bg-red-50 text-red-600 border-red-200',
    HIRED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export default function StatusBadge({ status }) {
    const classes = STATUS_STYLES[status] || 'bg-gray-50 text-gray-600 border-gray-200';

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}`}>
            {status}
        </span>
    );
}
