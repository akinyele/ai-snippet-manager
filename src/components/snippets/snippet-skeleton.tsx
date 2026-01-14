/**
 * SNIPPET SKELETON
 *
 * Loading placeholder for snippets
 */

export function SnippetSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
            </div>

            {/* Tags */}
            <div className="flex gap-2 mb-3">
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>

            {/* Code block */}
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>

            {/* Footer */}
            <div className="mt-3 h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>
    )
}
