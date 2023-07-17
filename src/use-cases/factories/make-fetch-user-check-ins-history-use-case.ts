import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history'

import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

// fabrica de depedencias - FACTORY PATTERN

export function makeFetchUserCheckInHistoryUseCase() {
  const checkInRepository = new PrismaCheckInsRepository()
  const useCase = new FetchUserCheckInsHistoryUseCase(checkInRepository)

  return useCase
}
