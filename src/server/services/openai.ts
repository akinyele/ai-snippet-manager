/**
 * OPENAI SERVICE
 *
 * Wrapper around OpenAI API for AI-powered features
 * Handles embeddings and chat completions
 */

import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Generate embeddings for semantic search
 *
 * Embeddings are vector representations of text that capture meaning.
 * Similar snippets will have similar embeddings (measured by cosine similarity)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        const response = await openai.embeddings.create({
            model: 'text-embedding-3-small', // Cost-effective embedding model
            input: text,
        })

        return response.data[0].embedding
    } catch (error) {
        console.error('Error generating embedding:', error)
        throw new Error('Failed to generate embedding')
    }
}

/**
 * Calculate cosine similarity between two embeddings
 *
 * Returns a value between -1 and 1:
 * - 1 means identical vectors (very similar)
 * - 0 means orthogonal (no similarity)
 * - -1 means opposite (very different)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))

    return dotProduct / (magnitudeA * magnitudeB)
}

/**
 * Analyze code and provide insights
 *
 * Uses GPT to explain code, suggest improvements, and identify issues
 */
export async function analyzeCode(code: string, language: string) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `You are a code analysis expert. Analyze the provided ${language} code and provide:
1. A brief explanation of what it does (2-3 sentences)
2. Complexity assessment (Simple/Medium/Complex)
3. One specific improvement suggestion
4. Any potential issues or bugs

Keep your response concise and practical.`,
                },
                {
                    role: 'user',
                    content: code,
                },
            ],
            temperature: 0.3, // Lower temperature for more consistent analysis
            max_tokens: 300,
        })

        return response.choices[0].message.content
    } catch (error) {
        console.error('Error analyzing code:', error)
        throw new Error('Failed to analyze code')
    }
}

/**
 * Generate snippet suggestions based on description
 *
 * Uses GPT to suggest useful code snippets
 */
export async function suggestSnippet(description: string, language: string) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `You are a helpful coding assistant. Generate a practical ${language} code snippet based on the user's description.
Provide ONLY the code, no explanations or markdown. Make it production-ready and include comments.`,
                },
                {
                    role: 'user',
                    content: description,
                },
            ],
            temperature: 0.7,
            max_tokens: 500,
        })

        return response.choices[0].message.content
    } catch (error) {
        console.error('Error suggesting snippet:', error)
        throw new Error('Failed to generate suggestion')
    }
}

/**
 * Semantic search using natural language
 *
 * Converts query to embedding and finds similar snippets
 */
export async function semanticSearch(
    query: string,
    snippets: Array<{ id: string; title: string; description: string; code: string }>
) {
    try {
        // Generate embedding for search query
        const queryEmbedding = await generateEmbedding(query)

        // Generate embeddings for all snippets (in practice, these should be cached)
        const snippetsWithSimilarity = await Promise.all(
            snippets.map(async (snippet) => {
                // Combine title, description, and code for better matching
                const snippetText = `${snippet.title} ${snippet.description || ''} ${snippet.code}`
                const snippetEmbedding = await generateEmbedding(snippetText)
                const similarity = cosineSimilarity(queryEmbedding, snippetEmbedding)

                return {
                    ...snippet,
                    similarity,
                }
            })
        )

        // Sort by similarity and return top matches
        return snippetsWithSimilarity
            .sort((a, b) => b.similarity - a.similarity)
            .filter((s) => s.similarity > 0.7) // Only return good matches
            .slice(0, 5) // Top 5 results
    } catch (error) {
        console.error('Error in semantic search:', error)
        throw new Error('Failed to perform semantic search')
    }
}
