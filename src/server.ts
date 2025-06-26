import express, { Request, Response, NextFunction } from 'express'
import rateLimit from 'express-rate-limit'
import crypto from 'crypto'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { promises as fs } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

export function createServer(distDir = path.join(__dirname, '..', 'dist')) {
  const app = express()

  // Rate limiter: maximum of 100 requests per 15 minutes
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })

  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.locals.nonce = crypto.randomBytes(16).toString('base64')
    next()
  })

  app.use((_req: Request, res: Response, next: NextFunction) => {
    const nonce = res.locals.nonce as string
    res.setHeader(
      'Content-Security-Policy',
      `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'nonce-${nonce}'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`
    )
    next()
  })

  app.get('/', limiter, async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const indexPath = path.join(distDir, 'index.html')
      let html = await fs.readFile(indexPath, 'utf8')
      html = html.replace(/__NONCE__/g, res.locals.nonce as string)
      res.type('html').send(html)
    } catch (error) {
      next(error)
    }
  })

  app.use(express.static(distDir))

  return app
}

export function startServer(port = Number(process.env.PORT) || 3000) {
  const app = createServer()
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))
) {
  startServer()
}
