import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Bh Sport Fitness perto',
      description: null,
      phone: null,
      latitude: -19.8797709,
      longitude: -43.9600789,
    })

    await gymsRepository.create({
      title: 'Pratique Fitness longe',
      description: null,
      phone: null,
      latitude: -19.8040715,
      longitude: -43.1518558,
    })
    const { gyms } = await sut.execute({
      userLatitude: -19.8797709,
      userLongitude: -43.9600789,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Bh Sport Fitness perto' }),
    ])
  })
})
