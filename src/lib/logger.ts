export interface LogContext {
  [key: string]: unknown
}

/**
 * Basic structured logger used across client and server.
 */
export const logger = {
  info(message: string, context: LogContext = {}): void {
    const entry = {
      level: 'info',
      timestamp: new Date().toISOString(),
      message,
      ...context
    }
    console.log(entry)
  },
  error(message: string, error?: Error, context: LogContext = {}): void {
    const entry = {
      level: 'error',
      timestamp: new Date().toISOString(),
      message,
      ...(error ? { stack: error.stack } : {}),
      ...context
    }
    console.error(entry)
  }
}
