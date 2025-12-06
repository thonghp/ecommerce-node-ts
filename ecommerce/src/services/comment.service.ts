import { addComment, getCommentsByParentId, deleteComments } from '~/models/repositories/comment.repo'
import type { AddCommentParams, DeleteCommentParams, GetCommentsByIdParams } from '~/types/commentRepo'

class CommentService {
  /*
    Add comment [user shop]
    Get a list of comments [user shop]
    Delete a comment [user shop admin]
  */
  static async createComment({ productId, userId, content, parentCommentId = null }: AddCommentParams) {
    return await addComment({ productId, userId, content, parentCommentId })
  }

  static async getCommentsByParentId({ productId, parentCommentId, limit, offset }: GetCommentsByIdParams) {
    return await getCommentsByParentId({ productId, parentCommentId, limit, offset })
  }

  static async deleteComments({ commentId, productId }: DeleteCommentParams) {
    return await deleteComments({ commentId, productId })
  }
}
export default CommentService
