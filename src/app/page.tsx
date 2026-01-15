'use client'

import { useState, useCallback } from 'react'
import { SearchInput } from '@/components/snippets/search-input'
import { SnippetList } from '@/components/snippets/snippet-list'
import { SnippetForm } from '@/components/snippets/snippet-form'
import { Toaster } from 'react-hot-toast'
import { Plus, X } from 'lucide-react'
import { SemanticSearch } from '@/components/snippets/semantic-search'
import { ThemeToggle } from '@/components/theme-toggle'
import {inferRouterOutputs} from "@trpc/server";
import type {AppRouter} from "@/server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;
type Snippet = RouterOutput['snippet']['getById'];


export default function Home() {
    const [showForm, setShowForm] = useState(false)
    const [editingSnippet, setEditingSnippet] = useState<Snippet>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [useSemanticSearch, setUseSemanticSearch] = useState(false)

    const handleEdit = useCallback((snippet: Snippet) => {
        setEditingSnippet(snippet)
        setShowForm(true)
    }, [])

    const handleCloseForm = useCallback(() => {
        setShowForm(false)
        setEditingSnippet(null)
    }, [])

    return (
        <main className="min-h-screen bg-gray-50">
            <Toaster position="top-right" />

            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                AI Snippet Manager
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Save, search, and organize your code snippets
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {showForm ? (
                                    <>
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        New Snippet
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {showForm ? (
                    // FORM VIEW - Only show form
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingSnippet ? 'Edit Snippet' : 'Create New Snippet'}
                        </h2>
                        <SnippetForm
                            initialData={editingSnippet}
                            onSuccess={handleCloseForm}
                        />
                    </div>
                ) : (
                    // LIST VIEW - Only show search and list
                    <div className="space-y-4">
                        {/* Search Mode Toggle */}
                        <div className="flex items-center gap-4 pb-4 border-b">
                            <button
                                onClick={() => setUseSemanticSearch(false)}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    !useSemanticSearch
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Keyword Search
                            </button>
                            <button
                                onClick={() => setUseSemanticSearch(true)}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    useSemanticSearch
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                🤖 AI Semantic Search
                            </button>
                        </div>

                        {/* Conditional rendering based on search mode */}
                        {useSemanticSearch ? (
                            <SemanticSearch onEdit={handleEdit} />
                        ) : (
                            <>
                                <SearchInput onSearch={setSearchQuery} />
                                <SnippetList searchQuery={searchQuery} onEdit={handleEdit} />
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            <p>Built with Next.js 15, React 19, tRPC, and OpenAI</p>
                            <p className="mt-1">
                                Created by{' '}
                                <a
                                    href="<https://github.com/akinyele>"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Akinyele Thompson
                                </a>
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <a
                                href="<https://github.com/akinyele/ai-snippet-manager>"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                View Source
                            </a>
                            <a
                                href="<https://linkedin.com/in/akinyelethompson>"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                                LinkedIn
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

        </main>

    )
}