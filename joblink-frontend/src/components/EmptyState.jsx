export default function EmptyState({ icon = '📭', title, subtitle, action }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-5xl mb-4">{icon}</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
            {subtitle && <p className="text-sm text-gray-500 text-center max-w-sm">{subtitle}</p>}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}
