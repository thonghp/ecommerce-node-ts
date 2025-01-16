import { Router } from 'express'
import { authentication } from '~/auth/authUtils'
import accessController from '~/controllers/access.controller'
import asyncHandler from '~/helpers/asyncHandler'

const router = Router()

router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))

router.use(authentication)
router.post('/shop/logout', asyncHandler(accessController.logout))
router.post('/shop/handleRefreshToken', asyncHandler(accessController.handleRefreshToken))

export default router
