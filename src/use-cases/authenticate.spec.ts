import { expect, describe, it } from 'vitest'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsErros } from './errors/invalid-credentials-error'

describe('Autheticate Use Case', () => {
  // deve ser capaz de registrar
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUserRepository()
    const authenticateUseCase = new AuthenticateUseCase(usersRepository)

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

  // deve ser capaz de autenticar com e-mail errado
  it('should be able to authenticate with wrong email', async () => {
    const usersRepository = new InMemoryUserRepository()
    const authenticateUseCase = new AuthenticateUseCase(usersRepository)
    expect(() =>
      authenticateUseCase.execute({
        email: 'prisma@prisma.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsErros)
  })
  // deve ser capaz de autenticar com senha errada
  it('should be able to authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUserRepository()
    const authenticateUseCase = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      name: 'lerdo',
      email: 'prisma@prisma.com',
      password_hash: await hash('123456', 6),
    })

    expect(() =>
      authenticateUseCase.execute({
        email: 'prisma@prisma.com',
        password: '1234516',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsErros)
  })
})
