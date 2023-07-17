import { CreateGymUseCase } from '../create-gym'

import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

// fabrica de depedencias - FACTORY PATTERN
export function makeCreateGymUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new CreateGymUseCase(gymsRepository)

  return useCase
}
