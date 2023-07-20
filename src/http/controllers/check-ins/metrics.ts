import { FastifyReply, FastifyRequest } from 'fastify'

import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metric-use-case'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  // FACTORY PATTERN
  const getUserMetricsUseCase = makeGetUserMetricsUseCase()

  const { checkinsCount } = await getUserMetricsUseCase.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({
    checkinsCount,
  })
}
