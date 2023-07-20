import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Register (e2e)', () => {
  // executar antes
  beforeAll(async () => {
    await app.ready()
  })
  // executa depois
  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John doe',
      email: 'johndoe@gmail.com',
      password: '1234566',
    })

    expect(response.statusCode).toEqual(201)
  })
})
