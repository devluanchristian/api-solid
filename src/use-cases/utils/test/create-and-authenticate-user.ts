import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  // faz a criação de uma conta
  await prisma.user.create({
    data: {
      name: 'Luan Christian',
      email: 'luanchristian@gmail.com',
      password_hash: await hash('123456', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })
  // loga essa conta criada
  const authResponse = await request(app.server).post('/sessions').send({
    email: 'luanchristian@gmail.com',
    password: '123456',
  })
  // pega o token da conta criada e retorna esse token
  const { token } = authResponse.body
  return { token }
}
