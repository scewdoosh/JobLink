function SkeletonBlock({ className = '' }) {
    return (
        <div
            className={`bg-gray-200 rounded-lg ${className}`}
            style={{ animation: 'skeleton-pulse 1.5s ease-in-out infinite' }}
        />
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <SkeletonBlock className="h-5 w-3/4 mb-3" />
            <SkeletonBlock className="h-4 w-1/2 mb-4" />
            <div className="flex gap-3 mb-4">
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="h-4 w-28" />
            </div>
            <div className="flex gap-1.5">
                <SkeletonBlock className="h-6 w-16 rounded-full" />
                <SkeletonBlock className="h-6 w-20 rounded-full" />
                <SkeletonBlock className="h-6 w-14 rounded-full" />
            </div>
        </div>
    );
}

export function DetailSkeleton() {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm">
            <SkeletonBlock className="h-8 w-2/3 mb-4" />
            <SkeletonBlock className="h-4 w-1/3 mb-6" />
            <div className="space-y-3">
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-5/6" />
                <SkeletonBlock className="h-4 w-4/6" />
            </div>
        </div>
    );
}

export function FormSkeleton() {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm space-y-6">
            <SkeletonBlock className="h-6 w-1/3 mb-4" />
            {[...Array(4)].map((_, i) => (
                <div key={i}>
                    <SkeletonBlock className="h-4 w-24 mb-2" />
                    <SkeletonBlock className="h-11 w-full rounded-xl" />
                </div>
            ))}
        </div>
    );
}
