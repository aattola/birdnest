import { test, describe, expect } from 'vitest'
import server from '../src/server'

describe('Server', () => {
  test('Should return server instance', async () => {
    expect(typeof server).eq('object')
    await server.close()
  })
})
