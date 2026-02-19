import { Permission, Query } from 'accesscontrol'
import type { NextFunction, Request, Response } from 'express'
import { AuthFailureError } from '~/core/error.response'
import rbac from './role.middleware'
import { roleList } from '~/services/rbac.service'

let isGrantsLoaded = false
const grantAccess = (action: string, resource: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // có thể thay thế setGrant này vào cache hoặc redis để giúp cải thiện hiệu suất
      if (!isGrantsLoaded) {
        const grants = await roleList({ userId: 9999 })
        rbac.setGrants(grants)
        isGrantsLoaded = true
      }

      const rol_name = req.query.role as string
      const permission = rbac.can(rol_name)[action as keyof Query](resource) as Permission
      if (!permission.granted) {
        throw new AuthFailureError('you dont have permission...')
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

export { grantAccess }
