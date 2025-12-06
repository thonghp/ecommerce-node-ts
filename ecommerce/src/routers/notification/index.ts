import { Router } from 'express'
import { authentication } from '~/auth/authUtils'
import notificationController from '~/controllers/notification.controller'
import asyncHandler from '~/helpers/asyncHandler'
const router = Router()

router.use(authentication)
router.get('', asyncHandler(notificationController.listNotifyByUser))

export default router
