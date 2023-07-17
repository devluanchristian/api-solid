import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CheckInUseCase } from '../check-in'

import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

// fabrica de depedencias - FACTORY PATTERN

export function makeCheckInUseCase() {
  const checkInRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new CheckInUseCase(checkInRepository, gymsRepository)

  return useCase
}
