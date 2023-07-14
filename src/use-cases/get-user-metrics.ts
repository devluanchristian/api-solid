import { ICheckInsRepository } from '@/repositories/@type-check-ins-repository'

interface IGetUserMetricsUseCaseRequest {
  userId: string
}

interface IGetUserMetricsUseCaseResponse {
  checkinsCount: number
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute({
    userId,
  }: IGetUserMetricsUseCaseRequest): Promise<IGetUserMetricsUseCaseResponse> {
    const checkinsCount = await this.checkInsRepository.countById(userId)
    return {
      checkinsCount,
    }
  }
}
