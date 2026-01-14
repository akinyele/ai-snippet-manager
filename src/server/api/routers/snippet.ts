import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'

/**
 * SNIPPET ROUTER
 *
 * This router handles all snippet-related operations.
 * Each procedure is a separate API endpoint.
 */

export const snippetRouter = createTRPCRouter({
    /**
     * GET ALL SNIPPETS
     *
     * This is a QUERY - used for fetching data
     * Queries should not modify data on the server
     */
    getAll: publicProcedure.query(async ({ ctx }) => {

        console.log("gett all snippets")

        // ctx.db is available because we added it to context in trpc.ts
        const snippets = await ctx.db.snippet.findMany({
            orderBy: { createdAt: 'desc' },
        })
        return snippets
    }),

    /**
     * GET SINGLE SNIPPET BY ID
     *
     * .input() defines what data the client must send
     * z.object() creates a Zod schema for validation
     */
    getById: publicProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            // input is fully typed based on the Zod schema!
            const snippet = await ctx.db.snippet.findUnique({
                where: { id: input.id },
            })

            if (!snippet) {
                throw new Error('Snippet not found')
            }

            return snippet
        }),

    /**
     * CREATE NEW SNIPPET
     *
     * This is a MUTATION - used for modifying data
     * Use mutations for create, update, delete operations
     */
    create: publicProcedure
        .input(
            z.object({
                title: z.string().min(1).max(200),
                description: z.string().optional(),
                code: z.string().min(1),
                language: z.string(),
                tags: z.string().default(''),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // Generate embedding for semantic search
            const embedText = `${input.title} ${input.description || ''} ${input.code}`
            let embedding: string | null = null

            try {
                const { generateEmbedding } = await import('@/server/services/openai')
                const embeddingArray = await generateEmbedding(embedText)
                embedding = JSON.stringify(embeddingArray)
            } catch (error) {
                console.error('Failed to generate embedding:', error)
                // Continue without embedding - feature degrades gracefully
            }

            const snippet = await ctx.db.snippet.create({
                data: {
                    ...input,
                    embedding,
                },
            })

            return snippet
        }),

    /**
     * DELETE SNIPPET
     */
    delete: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.snippet.delete({
                where: { id: input.id },
            })
            return { success: true }
        }),

    /**
     * UPDATE SNIPPET
     *
     * Allows updating any field of an existing snippet
     */
    update: publicProcedure
        .input(
            z.object({
                id: z.string(),
                title: z.string().min(1).max(200).optional(),
                description: z.string().optional(),
                code: z.string().min(1).optional(),
                language: z.string().optional(),
                tags: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input

            const snippet = await ctx.db.snippet.update({
                where: { id },
                data,
            })

            return snippet
        }),

    /**
     * SEARCH SNIPPETS
     *
     * Search by title, description, or tags
     */
    search: publicProcedure
        .input(
            z.object({
                query: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const snippets = await ctx.db.snippet.findMany({
                where: {
                    OR: [
                        { title: { contains: input.query, /*mode: 'insensitive'*/ } },
                        // **Note:** SQLite doesn't support `mode: 'insensitive'` for case-insensitive search. If you get an error, remove that option or switch to PostgreSQL for production.
                        { description: { contains: input.query } },
                        { tags: { contains: input.query } },
                        { language: { contains: input.query } },
                    ],
                },
                orderBy: { createdAt: 'desc' },
            })

            return snippets
        }),

})
