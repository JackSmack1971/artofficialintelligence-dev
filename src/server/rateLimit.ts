import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'
import { createClient } from 'redis'

import { HttpError, createErrorResponse } from './errors.js'
import { logger } from '../lib/logger.js'

export class RedisConnectionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RedisConnectionError'
  }
}

async function checkConnection(url: string): Promise<boolean> {
  const client = createClient({ url, socket: { connectTimeout: 5000 } })
  try {
    await client.connect()
    await client.ping()
    await client.disconnect()
    return true
  } catch (err) {
    logger.error('Redis health check failed', err as Error)
    return false
  }
}

function newClient(url: string): ReturnType<typeof createClient> {
  const client = createClient({
    url,
    socket: {
      connectTimeout: 10000,
      reconnectStrategy: (r) => Math.min(r * 100, 2000)
    }
  })
  client.on('error', (err) => logger.error('Redis error', err as Error))
  return client
}

function denyMiddleware() {
  return rateLimit({
    windowMs: 60_000,
    max: 0,
    handler: (_req, res) => {
      const err = new HttpError('Service unavailable', 503, 'REDIS_UNAVAILABLE')
      res
        .status(err.status)
        .json(createErrorResponse(err, res.locals.correlationId as string))
    }
  })
}

export async function setupRateLimiter() {
  const url = process.env.REDIS_URL
  if (!url) throw new RedisConnectionError('REDIS_URL not defined')
  if (!(await checkConnection(url))) return denyMiddleware()

  const client = newClient(url)
  await client.connect()

  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'production' ? 100 : 1000,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      sendCommand: (...args: string[]) => client.sendCommand(args)
    }),
    handler: (_req, res) => {
      const err = new HttpError('Too many requests', 429, 'RATE_LIMIT_EXCEEDED')
      res
        .status(err.status)
        .json(createErrorResponse(err, res.locals.correlationId as string))
    }
  })
}
