import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymRepository
let sut: CheckInUseCase

// Caso de uso de Check ins
describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)
    vi.useFakeTimers()

    // criação da academia
    gymsRepository.items.push({
      id: 'gym-01',
      title: 'BH sport Fitness',
      description: 'Academia dos fortes',
      phone: '32112312',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })
  // Deve ser capaz de realizar o check-in.
  it('should be able to check in', async () => {
    gymsRepository.items.push({
      id: 'gym-01',
      title: 'BH sport Fitness',
      description: 'Academia dos fortes',
      phone: '32112312',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    })
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -19.8797709,
      userLontitude: -43.9600789,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  // não deve ser capaz de realizar o check-in duas vezez no mesmo dia.
  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -19.8797709,
      userLontitude: -43.9600789,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -19.8797709,
        userLontitude: -43.9600789,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
  // deve ser capaz de realizar o check in duas vezes em diferentes dias.
  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -19.8797709,
      userLontitude: -43.9600789,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -19.8797709,
      userLontitude: -43.9600789,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })
})
