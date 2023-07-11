import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymRepository: InMemoryGymRepository
let sut: CreateGymUseCase

// Caso de uso de Criação de Academias
describe('Create gym Use Case', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymRepository()
    sut = new CreateGymUseCase(gymRepository)
  })
  // deve ser possivel criar uma academia
  it('should be possible to create an gym', async () => {
    const { gym } = await sut.execute({
      title: 'Bh sport fitt',
      description: null,
      phone: null,
      latitude: -19.8797709,
      longitude: -43.9600789,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
