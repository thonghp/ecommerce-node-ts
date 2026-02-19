import { Router } from 'express'
import profileController from '~/controllers/profile.controller'
import asyncHandler from '~/helpers/asyncHandler'
import { grantAccess } from '~/middlewares/rbac'
const router = Router()

// admin có thể truy cập tất cả profile
router.get('/viewAny', grantAccess('readAny', 'profile'), asyncHandler(profileController.profiles))
// user chỉ có thể truy cập profile của mình
router.get('/viewOwn', grantAccess('readOwn', 'profile'), asyncHandler(profileController.profile))

export default router
