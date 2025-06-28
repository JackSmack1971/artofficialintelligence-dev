import { promises as fs } from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import rateLimit from 'express-rate-limit'

import { logger } from './lib/logger.js'

import { securityMiddleware } from './server/security.js'

class ConfigurationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConfigurationError'
  }
}

function getAllowedOrigins(): string[] {
  const raw = process.env.CORS_ORIGIN
  if (!raw) throw new ConfigurationError('CORS_ORIGIN is not defined')
  return raw
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)
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
        callback(new Error('Not allowed by CORS'))
      }
    }
  }
}

const __dirname = dirname(fileURLToPath(import.meta.url))

export function createServer(distDir = path.join(__dirname, '..', 'dist')) {
  const app = express()
  app.set('trust proxy', 1)
  app.use(cors(createCorsOptions()))

  const enforceHttps = (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'production' && req.protocol === 'http') {
      return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`)
    }
    next()
  }

  app.use(enforceHttps)

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
  })

  app.use(securityMiddleware())

  app.get(
    '/',
    limiter,
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const indexPath = path.join(distDir, 'index.html')
        const html = await fs.readFile(indexPath, 'utf8')
        const safeHtml = html.split('__CSP_NONCE__').join(res.locals.nonce)
        res.type('html').send(safeHtml)
      } catch (error) {
        next(error)
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

  return app
}

export function startServer(port = Number(process.env.PORT) || 3000) {
  const app = createServer()
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
  startServer()
}
/* c8 ignore end */
