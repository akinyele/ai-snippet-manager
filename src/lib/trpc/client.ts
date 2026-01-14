/**
 * CLIENT-SIDE tRPC SETUP
 *
 * This is how your React components will talk to your tRPC API
 */

import { createTRPCReact } from '@trpc/react-query'
import { type AppRouter } from '@/server/api/root'

// Create typed hooks for your React components
export const api = createTRPCReact<AppRouter>({})
