import { v4 as uuidv4 } from 'uuid'

import { logger } from '@/lib/logger'

import type { NextFunction, Request, Response } from 'express'

export interface ErrorDetails {
  message: string
  code?: string
  field?: string
}

export interface ErrorMeta {
  timestamp: string
  correlationId: string
}

export interface ErrorResponse {
  success: false
  error: ErrorDetails
  meta: ErrorMeta
}

export class HttpError extends Error {
  status: number
  code?: string

  constructor(message: string, status = 500, code?: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.code = code
  }
}

export function createErrorResponse(
  err: HttpError | Error,
  correlationId: string
): ErrorResponse {
  const status = err instanceof HttpError ? err.status : 500
  const message = status >= 500 ? 'Internal server error' : err.message
  return {
    success: false,
    error: {
      message,
      ...(err instanceof HttpError && err.code ? { code: err.code } : {})
    },
    meta: { timestamp: new Date().toISOString(), correlationId }
  }
}

export function requestIdMiddleware() {
  return (_req: Request, res: Response, next: NextFunction) => {
    const id = uuidv4()
    res.locals.correlationId = id
    res.setHeader('X-Correlation-Id', id)
    next()
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response
): void {
  const id = (res.locals.correlationId as string) || uuidv4()
  const httpErr = err instanceof HttpError ? err : new HttpError(err.message)
  logger.error(httpErr.message, httpErr, { correlationId: id })
  const body = createErrorResponse(httpErr, id)
  res.status(httpErr.status).json(body)
}
