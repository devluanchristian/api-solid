import { IGymsRepository } from '@/repositories/@type-gyms-repository'
import { Gym } from '@prisma/client'

interface IFetchNearbyGymsUseCase {
  userLatitude: number
  userLongitude: number
}

interface IFetchNearbyGymsUseCaseResponse {
  gyms: Gym[]
}

export class FetchNearbyGymsUseCase {
  constructor(private gymRepository: IGymsRepository) {}
  async execute({
    userLatitude,
    userLongitude,
  }: IFetchNearbyGymsUseCase): Promise<IFetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })
    return { gyms }
  }
}
