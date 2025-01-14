import { NextFunction, Request, Response } from 'express'
import { findById } from '~/services/apikey.service'

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization'
}

/**
 * Check if the api key in the returned header is valid then move to the next middleware
 */
const apiKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString()
    if (!key) {
      return res.status(403).json({
        message: 'Forbidden Error'
      })
    }

    const objKey = await findById(key)
    if (!objKey) {
      return res.status(403).json({
        message: 'Forbidden Error'
      })
    }

    req.objKey = objKey
    return next()
  } catch (error) {
    console.error(`Error: ${error}`)
  }
}

/**
 * Check if the permission in the returned header is valid then move to the next middleware
 */
const permission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: 'Permission denied'
      })
    }

    const validPermission = req.objKey.permissions.includes(permission)
    if (!validPermission) {
      return res.status(403).json({
        message: 'Permission denied'
      })
    }

    return next()
  }
}

export { apiKey, permission }
