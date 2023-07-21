import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Refresh Token (e2e)', () => {
  // executar antes
  beforeAll(async () => {
    await app.ready()
  })
  // executa depois
  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh token', async () => {
    await request(app.server).post('/users').send({
      name: 'Luan Christian',
      email: 'luanchristian@gmail.com',
      password: '123456',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'luanchristian@gmail.com',
      password: '123456',
    })

    const cookies = authResponse.get('Set-Cookie')

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
