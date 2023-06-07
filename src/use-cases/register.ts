import { prisma } from '@/lib/prisma'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'
import { hash } from 'bcryptjs'

interface IRegisterUseCase {
  name: string
  email: string
  password: string
}
export async function registerUseCase({
  name,
  email,
  password,
}: IRegisterUseCase) {
  const userEithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userEithSameEmail) {
    throw new Error('E-mail already existis ')
  }

  const password_hash = await hash(password, 6)
  const prismaUsersRepository = new PrismaUsersRepository()
  await prismaUsersRepository.create({
    name,
    email,
    password_hash,
  })
}
