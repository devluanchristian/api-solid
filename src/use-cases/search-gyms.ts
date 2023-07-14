import { IGymsRepository } from '@/repositories/@type-gyms-repository'
import { Gym } from '@prisma/client'

interface ISearchGymsUseCase {
  query: string
  page: number
}

interface ISearchGymsUseCaseResponse {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(private gymRepository: IGymsRepository) {}
  async execute({
    query,
    page,
  }: ISearchGymsUseCase): Promise<ISearchGymsUseCaseResponse> {
    const gyms = await this.gymRepository.searchMany(query, page)
    return { gyms }
  }
}
