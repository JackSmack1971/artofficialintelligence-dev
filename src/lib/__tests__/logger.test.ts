import { describe, expect, it, vi } from 'vitest'

import { logger } from '../logger'

describe('logger', () => {
  it('logs info messages with timestamp', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    logger.info('hello', { foo: 'bar' })
    const [entry] = spy.mock.calls[0]
    expect(entry).toEqual(
      expect.objectContaining({
        level: 'info',
        timestamp: expect.any(String),
        message: 'hello',
        foo: 'bar'
      })
    )
    spy.mockRestore()
  })

  it('logs error messages with stack', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const err = new Error('oops')
    logger.error('failed', err, { id: 1 })
    const [entry] = spy.mock.calls[0]
    expect(entry).toEqual(
      expect.objectContaining({
        level: 'error',
        timestamp: expect.any(String),
        message: 'failed',
        stack: err.stack,
        id: 1
      })
    )
    spy.mockRestore()
  })
})
