import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Profile (e2e)', () => {
  // prepara o sevidor antes
  beforeAll(async () => {
    await app.ready()
  })
  // fecha o servidor depois
  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
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
    // pega o token da conta criada
    const { token } = authResponse.body

    // busca a conta autenticada atravez do token
    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'luanchristian@gmail.com',
      }),
    )
  })
})
