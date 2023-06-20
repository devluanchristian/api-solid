import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUserRepository
let sut: RegisterUseCase

// Caso de uso de Registros
describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository()
    sut = new RegisterUseCase(usersRepository)
  })
  // deve ser capaz de registrar
  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'lerdo',
      email: 'prisma@prismsa.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
  // deve ser capaz de criptografar(hash) a senha do usuário no registro
  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
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
    const email = 'prisma@prismsa.com'
    await sut.execute({
      name: 'lerdo',
      email,
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'lerdo',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
