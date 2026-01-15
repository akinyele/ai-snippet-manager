'use client'

import { api } from '@/lib/trpc/client'
import { SnippetCard } from './snippet-card'
import {SnippetSkeleton} from '@/components/snippets/snippet-skeleton';
import type { Snippet } from '@prisma/client'

interface SnippetListProps {
    searchQuery: string
    onEdit?: (snippet: Snippet) => void
}

export function SnippetList({ searchQuery, onEdit }: SnippetListProps) {
    const hasSearchQuery = searchQuery.trim().length > 0

    // Fetch all snippets (disabled when searching)
    const { data: allSnippets, isLoading: isLoadingAll } = api.snippet.getAll.useQuery(
        undefined,
        { enabled: !hasSearchQuery }
    )

    // Search snippets (disabled when not searching)
    const { data: searchResults, isLoading: isLoadingSearch } = api.snippet.search.useQuery(
        { query: searchQuery },
        { enabled: hasSearchQuery }
    )

    const snippets = hasSearchQuery ? searchResults : allSnippets
    const isLoading = hasSearchQuery ? isLoadingSearch : isLoadingAll

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <SnippetSkeleton key={i} />
                ))}
            </div>
        )
    }

    return (
        <>
            {snippets && snippets.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {snippets.map((snippet: Snippet) => (
                        <SnippetCard key={snippet.id} snippet={snippet} onEdit={onEdit} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500">
                        {searchQuery ? 'No snippets found matching your search.' : 'No snippets yet. Create your first one!'}
                    </p>
                </div>
            )}
        </>
    )
}