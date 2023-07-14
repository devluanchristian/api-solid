import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymRepository
let sut: SearchGymsUseCase

// Caso de uso de busca
describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  //
  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Bh Sport Fitness',
      description: null,
      phone: null,
      latitude: -19.8797709,
      longitude: -43.9600789,
    })

    await gymsRepository.create({
      title: 'Pratique Fitness',
      description: null,
      phone: null,
      latitude: -19.8797709,
      longitude: -43.9600789,
    })
    const { gyms } = await sut.execute({
      query: 'Sport',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Bh Sport Fitness' }),
    ])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Bh Sport Fitness ${i}`,
        description: null,
        phone: null,
        latitude: -19.8797709,
        longitude: -43.9600789,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Bh Sport',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Bh Sport Fitness 21' }),
      expect.objectContaining({ title: 'Bh Sport Fitness 22' }),
    ])
  })
})
