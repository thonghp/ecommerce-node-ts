import { Router } from 'express'
import productController from '~/controllers/product.controller'
import asyncHandler from '~/helpers/asyncHandler'
import { authentication } from '~/auth/authUtils'
const router = Router()

router.use(authentication)
router.post('', asyncHandler(productController.createProduct))

export default router
