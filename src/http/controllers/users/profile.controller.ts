import { makeUserProfileUseCase } from '@/use-cases/factories/make-user-profile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { undefined } from 'zod'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeUserProfileUseCase()
  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  })
}
