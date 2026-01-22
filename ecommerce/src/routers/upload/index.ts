import { Router } from 'express'
import { uploadDisk } from '~/configs/multer.config'
import uploadController from '~/controllers/upload.controller'
import asyncHandler from '~/helpers/asyncHandler'

const router = Router()

router.post('/product', asyncHandler(uploadController.uploadFile))
router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadFileThumb))

export default router
