import { Router } from 'express'
import { authentication } from '~/auth/authUtils'
import commentController from '~/controllers/comment.controller'
import asyncHandler from '~/helpers/asyncHandler'
const router = Router()

router.use(authentication)
router.post('', asyncHandler(commentController.createComment))
router.get('', asyncHandler(commentController.getCommentByParentId))
router.delete('', asyncHandler(commentController.deleteComment))

export default router
