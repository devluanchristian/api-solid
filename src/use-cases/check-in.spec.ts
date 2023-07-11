import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymRepository
let sut: CheckInUseCase

// Caso de uso de Check ins
describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)
    vi.useFakeTimers()

    // criação da academia

    await gymsRepository.create({
      id: 'gym-01',
      title: 'BH sport Fitness',
      description: 'Academia dos fortes',
      phone: '32112312',
      latitude: -19.8797709,
      longitude: -43.9600789,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })
  // Deve ser capaz de realizar o check-in.
  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -19.8797709,
      userLongitude: -43.9600789,
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
      userLongitude: -43.9600789,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -19.8797709,
        userLongitude: -43.9600789,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })
  // deve ser capaz de realizar o check in duas vezes em diferentes dias.
  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -19.8797709,
      userLongitude: -43.9600789,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -19.8797709,
      userLongitude: -43.9600789,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })
  // Não deve ser possível fazer check-in em uma academia distante.
  it('should not be able to check in on distant gym', async () => {
    // criação da academia
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Pratique Fitness',
      description: 'Academia dos fortes',
      phone: '321312312',
      latitude: new Decimal(-19.8778853),
      longitude: new Decimal(-43.9563516),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -19.8797709,
        userLongitude: -43.9600789,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
