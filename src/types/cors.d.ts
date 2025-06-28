declare module 'cors' {
  import { RequestHandler } from 'express'
  function cors(options?: unknown): RequestHandler
  export default cors
}
