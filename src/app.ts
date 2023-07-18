import fastify from 'fastify'

import { appRoutes } from './http/routes'
import fastifyJwt from '@fastify/jwt'
import { env } from './env'

export const app = fastify()

// Auth
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(appRoutes)
