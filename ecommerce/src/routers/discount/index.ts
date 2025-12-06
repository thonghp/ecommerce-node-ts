import { Router } from 'express'
import { authentication } from '~/auth/authUtils'
import asyncHandler from '~/helpers/asyncHandler'
import discountController from '~/controllers/discount.controller'

const router = Router()

router.post('/amount', asyncHandler(discountController.getDiscountAmount))
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodesWithProducts))

router.use(authentication)

router.post('', asyncHandler(discountController.createDiscountCode))
router.get('', asyncHandler(discountController.getAllDiscountCodesByShop))
router.patch('/:discountId', asyncHandler(discountController.updateDiscount))

export default router
