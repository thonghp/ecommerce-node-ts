import type { NextFunction, Request, Response } from 'express'

import { SuccessResponse, CREATED } from '~/core/success.response'
import CommentService from '~/services/comment.service'

class CommentController {
  createComment = async (req: Request, res: Response, next: NextFunction) => {
    new CREATED({
      message: 'create new comment!',
      metadata: await CommentService.createComment(req.body)
    }).send(res)
  }

  // getCommentByParentId = async (req: Request, res: Response, next: NextFunction) => {
  //   new SuccessResponse({
  //     message: 'get comment success',
  //     metadata: await CommentService.getCommentsByParentId(req.query)
  //   }).send(res)
  // }

  // deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  //   new SuccessResponse({
  //     message: 'delete comment success',
  //     metadata: await CommentService.deleteComments(req.body)
  //   }).send(res)
  // }
}

export default new CommentController()
