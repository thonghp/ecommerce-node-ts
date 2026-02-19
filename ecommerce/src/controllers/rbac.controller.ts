import type { NextFunction, Request, Response } from 'express'
import { SuccessResponse } from '~/core/success.response'
import { createResource, createRole, resourceList, roleList } from '~/services/rbac.service'

const newRole = async (req: Request, res: Response, next: NextFunction) => {
  new SuccessResponse({
    message: 'created role successfully!',
    metadata: await createRole(req.body)
  }).send(res)
}

const newResource = async (req: Request, res: Response, next: NextFunction) => {
  new SuccessResponse({
    message: 'created resource successfully!',
    metadata: await createResource(req.body)
  }).send(res)
}

const listRoles = async (req: Request, res: Response, next: NextFunction) => {
  new SuccessResponse({
    message: 'get list roles',
    metadata: await roleList(req.query)
  }).send(res)
}

const listResources = async (req: Request, res: Response, next: NextFunction) => {
  new SuccessResponse({
    message: 'get list resources',
    metadata: await resourceList(req.query)
  }).send(res)
}

export { newRole, newResource, listRoles, listResources }
