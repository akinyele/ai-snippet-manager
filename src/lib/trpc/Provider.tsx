'use client'

/**
 * TRPC PROVIDER
 *
 * This wraps your app and provides tRPC + React Query functionality
 * to all components
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { useState } from 'react'
import superjson from 'superjson'
import { api } from './client'

function getBaseUrl() {
    if (typeof window !== 'undefined') return '' // Browser should use relative URL
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // Vercel deployment
    return `http://localhost:${process.env.PORT ?? 3000}` // Dev server
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient())
    const [trpcClient] = useState(() =>
        api.createClient({
            links: [
                httpBatchLink({
                    url: `${getBaseUrl()}/api/trpc`,
                    transformer: superjson
                }),
            ],
        })
    )

    return (
        <api.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </api.Provider>
    )
}
