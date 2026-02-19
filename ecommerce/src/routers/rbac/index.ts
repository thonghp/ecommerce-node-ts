import { Router } from 'express'
import { listResources, listRoles, newResource, newRole } from '~/controllers/rbac.controller'
import asyncHandler from '~/helpers/asyncHandler'

const router = Router()

router.post('/role', asyncHandler(newRole))
router.get('/roles', asyncHandler(listRoles))
router.post('/resource', asyncHandler(newResource))
router.get('/resources', asyncHandler(listResources))

export default router
