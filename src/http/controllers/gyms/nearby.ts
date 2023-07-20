import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeFetchNearbyGymUseCase } from '@/use-cases/factories/make-fetch-nearby-gym-use-case'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })
  const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query)

  // FACTORY PATTERN
  const nearbyGymUseCase = makeFetchNearbyGymUseCase()

  const { gyms } = await nearbyGymUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({
    gyms,
  })
}
