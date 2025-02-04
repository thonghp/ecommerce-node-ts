import { Router } from 'express'
import productController from '~/controllers/product.controller'
import asyncHandler from '~/helpers/asyncHandler'
import { authentication } from '~/auth/authUtils'
const router = Router()

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProducts))
router.get('', asyncHandler(productController.findAllProducts))
router.get('/:productId', asyncHandler(productController.findProduct))

router.use(authentication)
router.post('', asyncHandler(productController.createProduct))
router.patch('/:productId', asyncHandler(productController.updateProduct))

router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishedForShop))

router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop))

export default router
