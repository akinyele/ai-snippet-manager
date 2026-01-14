'use client'

/**
 * AI SUGGEST BUTTON
 *
 * Generates code suggestions based on description
 */

import { useState } from 'react'
import { api } from '@/lib/trpc/client'
import { Sparkles, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface AISuggestButtonProps {
    onSuggestion: (code: string) => void
    language: string
}

export function AISuggestButton({ onSuggestion, language }: AISuggestButtonProps) {
    const [description, setDescription] = useState('')
    const [showInput, setShowInput] = useState(false)

    const suggestSnippet = api.ai.suggestSnippet.useMutation({
        onSuccess: (data) => {
            if (data.code) {
                onSuggestion(data.code)
                toast.success('AI generated code!')
                setShowInput(false)
                setDescription('')
            }
        },
        onError: (error) => {
            toast.error(`Suggestion failed: ${error.message}`)
        },
    })

    const handleSuggest = () => {
        if (description.trim().length < 10) {
            toast.error('Please provide a more detailed description')
            return
        }
        suggestSnippet.mutate({ description, language })
    }

    if (!showInput) {
        return (
            <button
                onClick={() => setShowInput(true)}
                className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700"
            >
                <Sparkles className="w-4 h-4" />
                Generate with AI
            </button>
        )
    }

    return (
        <div className="space-y-2 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <label className="block text-sm font-medium text-purple-900">
                Describe what code you want (be specific):
            </label>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Create a debounce hook that delays function execution by 300ms"
                rows={3}
                disabled={suggestSnippet.isPending}
            />
            <div className="flex gap-2">
                <button
                    onClick={handleSuggest}
                    disabled={suggestSnippet.isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors text-sm"
                >
                    {suggestSnippet.isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" />
                            Generate
                        </>
                    )}
                </button>
                <button
                    onClick={() => setShowInput(false)}
                    className="px-4 py-2 text-purple-600 hover:text-purple-700 text-sm"
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}
