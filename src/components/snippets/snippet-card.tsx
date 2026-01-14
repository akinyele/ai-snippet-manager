'use client'

/**
 * SNIPPET CARD COMPONENT
 *
 * Displays a single snippet with actions
 * Uses optimistic updates for deletions
 */

import { useState } from 'react'
import { api } from '@/lib/trpc/client'
import { CodeEditor } from './code-editor'
import { Copy, Trash2, Edit, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import {AIAnalyzeButton} from "@/components/snippets/ai-analyze-button";


type Snippet = {
    id: string
    title: string
    description?: string | null
    code: string
    language: string
    tags: string
    createdAt: Date
}

interface SnippetCardProps {
    snippet: Snippet
    onEdit?: (snippet: Snippet) => void
}

export function SnippetCard({ snippet, onEdit }: SnippetCardProps) {
    const [copied, setCopied] = useState(false)
    const utils = api.useUtils()

    // Delete mutation with optimistic update
    const deleteSnippet = api.snippet.delete.useMutation({
        // Optimistic update: remove from UI immediately
        onMutate: async ({ id }) => {
            // Cancel any outgoing refetches
            await utils.snippet.getAll.cancel()

            // Snapshot the previous value
            const previousSnippets = utils.snippet.getAll.getData()

            // Optimistically update the cache
            utils.snippet.getAll.setData(undefined, (old: Snippet[]) =>
                old?.filter((s) => s.id !== id)
            )

            return { previousSnippets }
        },

        // If mutation fails, rollback
        onError: (err, variables, context) => {
            utils.snippet.getAll.setData(undefined, context?.previousSnippets)
            toast.error('Failed to delete snippet')
        },

        // Always refetch after error or success
        onSettled: () => {
            utils.snippet.getAll.invalidate()
        },

        onSuccess: () => {
            toast.success('Snippet deleted')
        },
    })

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(snippet.code)
            setCopied(true)
            toast.success('Copied to clipboard!')

            // Reset icon after 2 seconds
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            toast.error('Failed to copy')
        }
    }

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this snippet?')) {
            deleteSnippet.mutate({ id: snippet.id })
        }
    }

    // Parse tags
    const tagList = snippet.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{snippet.title}</h3>
                    {snippet.description && (
                        <p className="text-sm text-gray-600 mt-1">{snippet.description}</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                    <button
                        onClick={handleCopy}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Copy code"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-green-600" />
                        ) : (
                            <Copy className="w-4 h-4 text-gray-600" />
                        )}
                    </button>

                    {onEdit && (
                        <button
                            onClick={() => onEdit(snippet)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit snippet"
                        >
                            <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                    )}

                    <button
                        onClick={handleDelete}
                        disabled={deleteSnippet.isPending}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete snippet"
                    >
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                </div>
            </div>

            {/* Tags and Language */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
          {snippet.language}
        </span>
                {tagList.map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {tag}
          </span>
                ))}
            </div>

            {/* Code Preview */}
            <CodeEditor
                value={snippet.code}
                onChange={() => {}}
                language={snippet.language}
                readOnly
                height="200px"
            />

            {/* AI Analysis */}
            <div className="mt-3">
                <AIAnalyzeButton code={snippet.code} language={snippet.language} />
            </div>

            {/* Footer */}
            <div className="mt-3 text-xs text-gray-500">
                Created {new Date(snippet.createdAt).toLocaleDateString()}
            </div>
        </div>
    )
}
