import { IGymsRepository } from '@/repositories/@type-gyms-repository'
import { Gym } from '@prisma/client'

interface ICreateGymUseCase {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface ICreateGymUseCaseResponse {
  gym: Gym
}

export class CreateGymUseCase {
  constructor(private gymRepository: IGymsRepository) {}
  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: ICreateGymUseCase): Promise<ICreateGymUseCaseResponse> {
    const gym = await this.gymRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    })
    return { gym }
  }
}
