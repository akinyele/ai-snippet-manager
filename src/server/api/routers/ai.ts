/**
 * AI ROUTER
 *
 * tRPC procedures for AI-powered features
 */

import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'
import {
    analyzeCode,
    suggestSnippet,
    semanticSearch,
    generateEmbedding,
} from '@/server/services/openai'

export const aiRouter = createTRPCRouter({
    /**
     * ANALYZE CODE
     *
     * Get AI insights about a code snippet
     */
    analyzeCode: publicProcedure
        .input(
            z.object({
                code: z.string().min(1),
                language: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            const analysis = await analyzeCode(input.code, input.language)
            return { analysis }
        }),

    /**
     * SUGGEST SNIPPET
     *
     * Generate code based on natural language description
     */
    suggestSnippet: publicProcedure
        .input(
            z.object({
                description: z.string().min(10),
                language: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            const suggestion = await suggestSnippet(input.description, input.language)
            return { code: suggestion }
        }),

    /**
     * SEMANTIC SEARCH
     *
     * Search snippets using natural language
     * Example: "find authentication code" instead of keyword "auth"
     */
    semanticSearch: publicProcedure
        .input(
            z.object({
                query: z.string().min(3),
            })
        )
        .query(async ({ ctx, input }) => {
            // Get all snippets
            const snippets = await ctx.db.snippet.findMany()

            // Perform semantic search
            const results = await semanticSearch(
                input.query,
                snippets.map((s) => ({
                    id: s.id,
                    title: s.title,
                    description: s.description || '',
                    code: s.code,
                }))
            )

            // Return full snippet data for matches
            return results.map((result) => {
                const snippet = snippets.find((s) => s.id === result.id)
                return {
                    ...snippet!,
                    similarity: result.similarity,
                }
            })
        }),

    /**
     * GENERATE EMBEDDING
     *
     * Create embedding for a snippet (used when saving)
     */
    generateEmbedding: publicProcedure
        .input(
            z.object({
                text: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            const embedding = await generateEmbedding(input.text)
            return { embedding: JSON.stringify(embedding) }
        }),
})
