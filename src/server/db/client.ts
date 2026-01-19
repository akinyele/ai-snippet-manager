import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'


const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

// Global variable to store Prisma client in development
// Prevents creating multiple instances during hot reload
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Create or reuse Prisma client
export const db =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
        log:
            process.env.NODE_ENV === 'development'
                ? ['query', 'error', 'warn']
                : ['error'],
    })

// Store in global variable for development
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
