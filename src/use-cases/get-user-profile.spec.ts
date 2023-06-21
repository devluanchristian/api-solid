import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUserRepository
let getUserProfileUseCase: GetUserProfileUseCase

// Caso de Uso para obter o perfil do usuário
describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository()
    getUserProfileUseCase = new GetUserProfileUseCase(usersRepository)
  })

  // deve ser capaz de obter o perfil do usuário
  it('should be able to get user profile', async () => {
    const createUser = await usersRepository.create({
      name: 'luan',
      email: 'prisma@prisma.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await getUserProfileUseCase.execute({
      userId: createUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('luan')
  })

  // não deve ser capaz de obter o perfil do usuário com id errado
  it('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      getUserProfileUseCase.execute({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
