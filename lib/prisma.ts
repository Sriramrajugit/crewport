import { PrismaClient } from '@prisma/client'

// Prisma initialization

// Use a global variable to ensure a single PrismaClient instance in development
const globalForPrisma = globalThis as any;

if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development'
            ? ['query', 'error', 'warn']
            : ['error'],
        errorFormat: 'pretty',
    });
}

export const prisma = globalForPrisma.prisma;

// Handle graceful shutdown
process.on('SIGINT', async () => {
    if (globalForPrisma.prisma) {
        await globalForPrisma.prisma.$disconnect();
    }
    process.exit(0);
});

process.on('SIGTERM', async () => {
    if (globalForPrisma.prisma) {
        await globalForPrisma.prisma.$disconnect();
    }
    process.exit(0);
});
