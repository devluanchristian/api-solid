import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUserRepository
let authenticateUseCase: AuthenticateUseCase

describe('Autheticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository()
    authenticateUseCase = new AuthenticateUseCase(usersRepository)
  })
  // deve ser capaz se autenticar
  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'lerdo',
      email: 'prisma@prisma.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await authenticateUseCase.execute({
      email: 'prisma@prisma.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  // não deve ser capaz de autenticar com e-mail errado
  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      authenticateUseCase.execute({
        email: 'prisma@prisma.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  // não deve ser capaz de autenticar com a senha errada
  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'lerdo',
      email: 'prisma@prisma.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      authenticateUseCase.execute({
        email: 'prisma@prisma.com',
        password: '1234516',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
