import { Router } from 'express'
import cartController from '~/controllers/cart.controller'
import asyncHandler from '~/helpers/asyncHandler'
const router = Router()

router.post('', asyncHandler(cartController.addToCart))
router.get('', asyncHandler(cartController.listToCart))
router.post('/update', asyncHandler(cartController.update))
router.delete('', asyncHandler(cartController.delete))

export default router
