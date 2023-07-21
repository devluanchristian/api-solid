import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/use-cases/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Check-in (e2e)', () => {
  // prepara o sevidor antes
  beforeAll(async () => {
    await app.ready()
  })
  // fecha o servidor depois
  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check-in', async () => {
    // busca a conta autenticada atravez do token
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'Pratique de Bairro',
        latitude: -19.8797709,
        longitude: -43.9600789,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -19.8797709,
        longitude: -43.9600789,
      })

    expect(response.statusCode).toEqual(201)
  })
})
