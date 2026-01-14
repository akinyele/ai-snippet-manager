/**
 * This is the main tRPC configuration file
 * It sets up the context, transformer, and base procedure
 */

import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { ZodError } from 'zod'
import { db } from '../db/client'

/**
 * CONTEXT
 *
 * This is the stuff that's available to all your tRPC procedures.
 * Think of it as dependency injection - you define what's available here,
 * and every procedure can access it.
 *
 * Common things to put in context:
 * - Database client (we're using Prisma)
 * - User session/auth info
 * - Request headers
 * - Logging utilities
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
    return {
        db,
        ...opts,
    }
}

/**
 * INITIALIZATION
 *
 * This is where we initialize tRPC with our configuration:
 * - transformer: superjson lets us pass Dates, Maps, Sets, etc.
 * - errorFormatter: Customize how errors are returned to the client
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError ? error.cause.flatten() : null,
            },
        }
    },
})

/**
 * REUSABLE EXPORTS
 *
 * These are the building blocks you'll use throughout your app:
 */

// Create new routers (collections of procedures)
export const createTRPCRouter = t.router

// Create a public procedure (no authentication required)
// You'll use this for every API endpoint
export const publicProcedure = t.procedure

// If you add auth later, you'd create:
// export const protectedProcedure = t.procedure.use(authMiddleware)
