/**
 * ROOT ROUTER
 *
 * This is where you combine all your routers into one main router.
 * As you add more features, you'll add more routers here.
 */

import { createTRPCRouter } from './trpc'
import { snippetRouter } from './routers/snippet'
import {aiRouter} from "@/server/api/routers/ai";

export const appRouter = createTRPCRouter({
    snippet: snippetRouter,
    // Future routers will go here:
    ai: aiRouter,
    // user: userRouter,
})

// Export type definition - this is the magic!
// This type will be used on the client for full type safety
export type AppRouter = typeof appRouter
