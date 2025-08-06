// // lib/prisma.ts
import { PrismaClient } from '../generated/prisma'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// lib/prisma.ts
// import { PrismaClient } from '../generated/prisma'

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined
// }

// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     datasources: {
//       db: {
//         url: process.env.DATABASE_URL,
//       },
//     },
//     // Explicitly disable all logging
//     log: [],
//     // Additional logging configuration to ensure no logs
//     errorFormat: 'minimal',
//   })

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
