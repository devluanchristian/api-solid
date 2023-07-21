import { app } from '@/app'
import { createAndAuthenticateUser } from '@/use-cases/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Search Gym (e2e)', () => {
  // prepara o servidor antes
  beforeAll(async () => {
    await app.ready()
  })
  // fecha o servidor depois
  afterAll(async () => {
    await app.close()
  })

  it('should be able to search gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Pratique de Bairro',
        description: null,
        phone: null,
        latitude: -19.8797709,
        longitude: -43.9600789,
      })
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Academia de Brabo',
        description: null,
        phone: null,
        latitude: -19.8797709,
        longitude: -43.9600789,
      })
    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: 'Academia',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Academia de Brabo',
      }),
    ])
  })
})
