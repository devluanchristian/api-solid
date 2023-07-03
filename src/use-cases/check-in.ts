import { CheckIn } from '@prisma/client'
import { ICheckInsRepository } from '@/repositories/@type-check-ins-repository'
import { IGymsRepository } from '@/repositories/@type-gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ICheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLontitude: number
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
  }: ICheckInUseCaseRequest): Promise<ICheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)
    if (!gym) {
      throw new ResourceNotFoundError()
    }
    // calcula distancia entre o usuario e academia

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
