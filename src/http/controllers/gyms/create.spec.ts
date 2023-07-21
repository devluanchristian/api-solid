import { app } from '@/app'
import { createAndAuthenticateUser } from '@/use-cases/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Gym (e2e)', () => {
  // prepara o sevidor antes
  beforeAll(async () => {
    await app.ready()
  })
  // fecha o servidor depois
  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    // busca a conta autenticada atravez do token
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Academia de Bairro',
        description: null,
        phone: null,
        latitude: -19.8797709,
        longitude: -43.9600789,
      })

    expect(response.statusCode).toEqual(201)
  })
})
