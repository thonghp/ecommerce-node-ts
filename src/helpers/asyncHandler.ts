import type { NextFunction, Request, RequestHandler, Response } from 'express'

/* eslint-disable @typescript-eslint/no-explicit-any */
type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Takes in an async function and if this function has an error, it will pass the error to the next
 * middleware for handling.
 */
// const asyncHandler = (excutation: AsyncFunction) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     excutation(req, res, next).catch(next)
//   }
// }

const asyncHandler = (fn: AsyncFunction): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

export default asyncHandler
