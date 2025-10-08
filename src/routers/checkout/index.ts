import { Router } from 'express'
import checkoutController from '~/controllers/checkout.controller'
import asyncHandler from '~/helpers/asyncHandler'
const router = Router()

router.post('/review', asyncHandler(checkoutController.checkoutReview))

export default router
