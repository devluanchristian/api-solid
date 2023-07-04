import { CheckIn } from '@prisma/client'
import { ICheckInsRepository } from '@/repositories/@type-check-ins-repository'
import { IGymsRepository } from '@/repositories/@type-gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { getDistanceBetweenCoordinates } from './utils/get-distance-between-coordinates'

interface ICheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface ICheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: ICheckInsRepository,
    private gymsRepository: IGymsRepository,
  ) {}

  async execute({
    gymId,
    userId,
    userLatitude,
    userLongitude,
  }: ICheckInUseCaseRequest): Promise<ICheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)
    if (!gym) {
      throw new ResourceNotFoundError()
    }
    // calcula distancia entre o usuario e academia
    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )
    // MAXIMA DISTANCIA EM KILOMENTROS
    const MAX_DISTANCE_KILOMETERS = 0.1
    if (distance > MAX_DISTANCE_KILOMETERS) {
      throw new Error()
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )
    if (checkInOnSameDay) {
      throw new Error()
    }
    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })
    return {
      checkIn,
    }
  }
}
