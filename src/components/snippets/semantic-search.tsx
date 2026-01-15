'use client'

/**
 * SEMANTIC SEARCH
 *
 * Natural language search powered by AI embeddings
 */

import { useState } from 'react'
import { api } from '@/lib/trpc/client'
import { Sparkles, Loader2 } from 'lucide-react'
import { SnippetCard } from './snippet-card'
import type { Snippet } from '@prisma/client'

interface SemanticSearchProps {
    onEdit?: (snippet: Snippet) => void
}

export function SemanticSearch({ onEdit }: SemanticSearchProps) {
    const [query, setQuery] = useState('')
    const [showResults, setShowResults] = useState(false)

    const { data: results, isLoading, refetch } = api.ai.semanticSearch.useQuery(
        { query },
        { enabled: false } // Don't run automatically
    )

    const handleSearch = () => {
        if (query.trim().length < 3) {
            return
        }
        setShowResults(true)
        refetch()
    }

    return (
        <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-900">AI Semantic Search</h3>
                </div>
                <p className="text-sm text-purple-700 mb-3">
                    Search using natural language. Try: &#34;find code for authentication&#34; or &#34;show me hooks&#34;
                </p>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Describe what you're looking for..."
                        className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={isLoading || query.trim().length < 3}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            'Search'
                        )}
                    </button>
                </div>
            </div>

            {showResults && (
                <div>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                        </div>
                    ) : results && results.length > 0 ? (
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">
                                Found {results.length} relevant snippet{results.length > 1 ? 's' : ''}:
                            </h4>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {results.map((snippet) => (
                                    <div key={snippet.id} className="relative">
                                        <SnippetCard snippet={snippet} onEdit={onEdit} />
                                        <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                                            {Math.round((snippet.similarity || 0) * 100)}% match
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-8">
                            No similar snippets found. Try a different query.
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
