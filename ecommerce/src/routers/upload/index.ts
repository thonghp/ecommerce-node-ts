import { Router } from 'express'
import uploadController from '~/controllers/upload.controller'
import asyncHandler from '~/helpers/asyncHandler'

const router = Router()

router.post('/product', asyncHandler(uploadController.uploadFile))

export default router
