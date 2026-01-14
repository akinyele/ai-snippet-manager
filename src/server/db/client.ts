import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql';


// When running Prisma Client on Bun, use the @prisma/adapter-libsql driver adapter.
// Bun doesn't support the native SQLite driver that better-sqlite3 relies on
const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL ?? '',
});

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
