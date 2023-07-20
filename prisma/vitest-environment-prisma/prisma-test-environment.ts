import { Environment } from 'vitest'
import 'dotenv/config'
import { randomUUID } from 'crypto'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'

// # DataBase
// DATABASE_URL="postgresql://docker:docker@localhost:5432/apisolid?schema=public"

// função que modifica nossa url do banco de dados criando sub banco para teste, isolando do ambiente de produção
const prisma = new PrismaClient()
function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable')
  }
  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schema)
  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  async setup() {
    console.log('Executando Setup')
    const schema = randomUUID()
    const dataBaseUrl = generateDatabaseURL(schema)

    process.env.DATABASE_URL = dataBaseUrl

    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        console.log('Executando Teardown')

        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )
        await prisma.$disconnect()
      },
    }
  },
}
