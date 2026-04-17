import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  (new PrismaClient({
    log: ["query", "error", "warn"],
  }))

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Simple connection check log
console.log("Prisma Client initialized with NODE_ENV:", process.env.NODE_ENV);
