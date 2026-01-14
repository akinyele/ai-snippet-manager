'use client'

/**
 * AI ANALYZE BUTTON
 *
 * Triggers AI analysis of code and displays results
 */

import { useState } from 'react'
import { api } from '@/lib/trpc/client'
import { Brain, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface AIAnalyzeButtonProps {
    code: string
    language: string
}

export function AIAnalyzeButton({ code, language }: AIAnalyzeButtonProps) {
    const [showAnalysis, setShowAnalysis] = useState(false)

    const analyzeCode = api.ai.analyzeCode.useMutation({
        onSuccess: () => {
            setShowAnalysis(true)
        },
        onError: (error) => {
            toast.error(`Analysis failed: ${error.message}`)
        },
    })

    const handleAnalyze = () => {
        if (code.trim().length < 10) {
            toast.error('Code is too short to analyze')
            return
        }
        analyzeCode.mutate({ code, language })
    }

    return (
        <div>
            <button
                onClick={handleAnalyze}
                disabled={analyzeCode.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
                {analyzeCode.isPending ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing...
                    </>
                ) : (
                    <>
                        <Brain className="w-4 h-4" />
                        AI Analyze
                    </>
                )}
            </button>

            {showAnalysis && analyzeCode.data && (
                <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-purple-900">AI Analysis</h4>
                        <button
                            onClick={() => setShowAnalysis(false)}
                            className="text-purple-600 hover:text-purple-800 text-sm"
                        >
                            Close
                        </button>
                    </div>
                    <div className="text-sm text-purple-800 whitespace-pre-wrap">
                        {analyzeCode.data.analysis}
                    </div>
                </div>
            )}
        </div>
    )
}
