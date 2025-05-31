import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function connectToDb() {
  try {
    await prisma.$connect()
    console.log('✅ Connected to the database')
  } catch (err) {
    console.error('❌ Failed to connect to the database:', err)
    process.exit(1)
  }
}

export { prisma }
export type { PrismaClient } from '@prisma/client'