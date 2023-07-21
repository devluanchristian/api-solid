import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  // faz a criação de uma conta
  await request(app.server).post('/users').send({
    name: 'Luan Christian',
    email: 'luanchristian@gmail.com',
    password: '123456',
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
