import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
  // deve ser capaz de registrar
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUserRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'lerdo',
      email: 'prisma@prismsa.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
  // deve ser capaz de criptografar(hash) a senha do usuário no registro
  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUserRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'lerdo',
      email: 'prisma@prismsa.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })
  // não deve ser capaz de se registrar com o mesmo e-mail duas vezes
  it('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUserRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const email = 'prisma@prismsa.com'
    await registerUseCase.execute({
      name: 'lerdo',
      email,
      password: '123456',
    })

    await expect(() =>
      registerUseCase.execute({
        name: 'lerdo',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
