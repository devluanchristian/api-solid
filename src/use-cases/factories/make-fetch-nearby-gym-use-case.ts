import { FetchNearbyGymsUseCase } from '../fetch-nearby-gyms'

import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

// fabrica de depedencias - FACTORY PATTERN
export function makeFetchNearbyGymUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new FetchNearbyGymsUseCase(gymsRepository)

  return useCase
}
