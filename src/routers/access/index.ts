import { Router } from 'express'
import accessController from '~/controllers/access.controller'
import asyncHandler from '~/helpers/asyncHandler'

const router = Router()

router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))

export default router
