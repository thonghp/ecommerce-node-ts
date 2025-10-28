import { addComment, getCommentsByParentId } from '~/models/repositories/comment.repo'
import type { AddCommentParams, GetCommentsByIdParams } from '~/types/commentRepo'

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

  // static async deleteComments({ commentId, productId }) {
  //   const foundProduct = await findProduct({ product_id: productId })
  //   if (!foundProduct) {
  //     throw new NotFoundError('Product not found')
  //   }

  //   // xac định giá trị left right của comment
  //   const comment = await Comment.findById(commentId)
  //   if (!comment) {
  //     throw new NotFoundError('Comment not found')
  //   }

  //   const leftValue = comment.comment_left
  //   const rightValue = comment.comment_right
  //   // tính width
  //   const width = rightValue - leftValue + 1
  //   // delete all children comments
  //   await Comment.deleteMany({
  //     comment_productId: convertToObjectId(productId),
  //     comment_left: { $gte: leftValue, $lte: rightValue }
  //   })

  //   // update all comments after the deleted comment
  //   await Comment.updateMany(
  //     {
  //       comment_productId: convertToObjectId(productId),
  //       comment_right: { $gt: rightValue }
  //     },
  //     {
  //       $inc: { comment_right: -width }
  //     }
  //   )

  //   await Comment.updateMany(
  //     {
  //       comment_productId: convertToObjectId(productId),
  //       comment_left: { $gt: rightValue }
  //     },
  //     {
  //       $inc: { comment_left: -width }
  //     }
  //   )

  //   return true
  // }
}
export default CommentService
