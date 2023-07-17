import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { ValidateCheckInUseCase } from '../validate-check-ins'

// fabrica de depedencias - FACTORY PATTERN

export function makeValidateCheckInUseCase() {
  const checkInRepository = new PrismaCheckInsRepository()
  const useCase = new ValidateCheckInUseCase(checkInRepository)

  return useCase
}
