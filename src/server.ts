import { promises as fs } from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'

import { env, loadEnv } from './config/environment.js'
import { logger } from './lib/logger.js'
import {
  HttpError,
  errorHandler,
  requestIdMiddleware
} from './server/errors.js'
import { setupRateLimiter } from './server/rateLimit.js'
import { securityMiddleware } from './server/security.js'



function getAllowedOrigins(): string[] {
  return env.CORS_ORIGIN
}

function createCorsOptions() {
  const whitelist = getAllowedOrigins()
  return {
    origin(
      origin: string | undefined,
      callback: (err: Error | null, ok?: boolean) => void
    ) {
      if (!origin || whitelist.includes(origin)) {
        callback(null, true)
      } else {
        callback(new HttpError('Not allowed by CORS', 403, 'INVALID_ORIGIN'))
      }
    }
  }
}


const __dirname = dirname(fileURLToPath(import.meta.url))

export async function createServer(distDir = path.join(__dirname, '..', 'dist')) {
  loadEnv()
  const app = express()
  app.set('trust proxy', 1)
  app.use(requestIdMiddleware())
  app.use(cors(createCorsOptions()))

  const enforceHttps = (req: Request, res: Response, next: NextFunction) => {
    if (env.NODE_ENV === 'production' && req.protocol === 'http') {
      return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`)
    }
    next()
  }

  app.use(enforceHttps)
  const limiter = await setupRateLimiter()
  app.use(limiter)
  app.use(securityMiddleware())

  app.get(
    '/',
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const indexPath = path.join(distDir, 'index.html')
        const html = await fs.readFile(indexPath, 'utf8')
        const safeHtml = html.split('__CSP_NONCE__').join(res.locals.nonce)
        res.type('html').send(safeHtml)
      } catch (error) {
        next(new HttpError('Failed to load index', 500))
      }
    }
  )

  app.post(
    '/csp-report',
    express.json({ type: ['json', 'application/csp-report'] }),
    (_req, res) => {
      console.warn('CSP Violation', _req.body)
      res.status(204).end()
    }
  )

  app.use(express.static(distDir))

  app.use((_req, _res, next) => next(new HttpError('Not Found', 404)))
  app.use(errorHandler)

  return app
}

export async function startServer(port = env.PORT) {
  loadEnv()
  const app = await createServer()
  const server = app.listen(port, () => {
    logger.info(`Server running on port ${port}`)
  })
  return server
}

/* c8 ignore start */
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))
) {
  startServer().catch((err) => {
    logger.error('Failed to start server', err as Error)
  })
}
/* c8 ignore end */
