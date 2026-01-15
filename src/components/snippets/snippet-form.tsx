'use client'

/**
 * SNIPPET FORM COMPONENT
 *
 * Uses React 19 Actions for form handling
 * Demonstrates optimistic updates and error handling
 */

import {useCallback, useState, useTransition} from 'react'
import { api } from '@/lib/trpc/client'
import { CodeEditor } from './code-editor'
import toast from 'react-hot-toast'
import {AISuggestButton} from "@/components/snippets/ai-suggest-button";

import type { Snippet } from '@prisma/client'


interface SnippetFormProps {
    onSuccess?: () => void
    initialData?: Pick<Snippet, "id" | "title" | "description" | "code" | "language" | "tags"> | null
}

// Common programming languages for the dropdown
const LANGUAGES = [
    'javascript',
    'typescript',
    'python',
    'java',
    'html',
    'css',
    'json',
    'sql',
    'bash',
    'go',
    'rust',
    'c',
    'cpp',
    'csharp',
]

export function SnippetForm({ onSuccess, initialData }: SnippetFormProps) {
    const [isPending, startTransition] = useTransition()
    const utils = api.useUtils()

    // Form state
    const [title, setTitle] = useState(initialData?.title || '')
    const [description, setDescription] = useState(initialData?.description || '')
    const [code, setCode] = useState(initialData?.code || '')
    const [language, setLanguage] = useState(initialData?.language || 'javascript')
    const [tags, setTags] = useState(initialData?.tags || '')


    const handleAISuggestion = useCallback((generatedCode: string) => {
        setCode(generatedCode)
    }, [])

    // tRPC mutations
    const createSnippet = api.snippet.create.useMutation({
        onSuccess: () => {
            toast.success('Snippet created!')
            utils.snippet.getAll.invalidate() // Refresh the list
            onSuccess?.()

            // Reset form
            setTitle('')
            setDescription('')
            setCode('')
            setLanguage('javascript')
            setTags('')
        },
        onError: (error) => {
            toast.error(`Error: ${error.message}`)
        },
    })

    const updateSnippet = api.snippet.update.useMutation({
        onSuccess: () => {
            toast.success('Snippet updated!')
            utils.snippet.getAll.invalidate()
            onSuccess?.()
        },
        onError: (error) => {
            toast.error(`Error: ${error.message}`)
        },
    })

    // React 19 Action for form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation
        if (!title.trim()) {
            toast.error('Title is required')
            return
        }
        if (!code.trim()) {
            toast.error('Code is required')
            return
        }

        // Use React 19 transition for smooth UI updates
        startTransition(() => {
            const data = {
                title: title.trim(),
                description: description.trim(),
                code: code.trim(),
                language,
                tags: tags.trim(),
            }

            if (initialData?.id) {
                // Update existing snippet
                updateSnippet.mutate({ id: initialData.id, ...data })
            } else {
                // Create new snippet
                createSnippet.mutate(data)
            }
        })
    }


    const isLoading = createSnippet.isPending || updateSnippet.isPending || isPending

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"                    placeholder="e.g., Debounce Hook"
                    disabled={isLoading}
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="What does this snippet do?"
                    rows={2}
                    disabled={isLoading}
                />
            </div>

            {/* Language */}
            <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                    Language *
                </label>
                <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                    required
                >
                    {LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>
                            {lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Code Editor */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code *
                </label>
                <CodeEditor
                    value={code}
                    onChange={setCode}
                    language={language}
                    readOnly={isLoading}
                />
            </div>

            {/* Tags */}
            <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                </label>
                <AISuggestButton
                    language={language}
                    onSuggestion={handleAISuggestion}
                />
                <input
                    type="text"
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="react, hooks, custom (comma-separated)"
                    disabled={isLoading}
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? 'Saving...' : initialData?.id ? 'Update Snippet' : 'Create Snippet'}
            </button>
        </form>
    )
}
