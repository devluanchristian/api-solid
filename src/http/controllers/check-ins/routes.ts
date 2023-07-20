import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { create } from './create'
import { validate } from './validate'
import { metrics } from './metrics'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)
  app.post('/gyms/:gymsId/check-ins', create)
  app.patch('/check-ins/:checkInId/check-ins', validate)
  app.get('/check-ins/metrics', metrics)
}
