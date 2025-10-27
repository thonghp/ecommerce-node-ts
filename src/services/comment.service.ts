import { addComment } from '~/models/repositories/comment.repo'
import type { CommentParams } from '~/types/commentRepo'

class CommentService {
  /*
    Add comment [user shop]
    Get a list of comments [user shop]
    Delete a comment [user shop admin]
  */
  static async createComment({ productId, userId, content, parentCommentId = null }: CommentParams) {
    return await addComment({ productId, userId, content, parentCommentId })
  }

  // static async getCommentsByParentId({
  //   productId,
  //   parentCommentId = null,
  //   limit = 50,
  //   offset = 0 // skip
  // }) {
  //   if (parentCommentId) {
  //     const parent = await Comment.findById(parentCommentId)
  //     if (!parent) {
  //       throw new NotFoundError('Not found comment for product')
  //     }

  //     const comments = await Comment.find({
  //       comment_productId: convertToObjectId(productId),
  //       comment_left: { $gt: parent.comment_left },
  //       comment_right: { $lte: parent.comment_right }
  //     })
  //       .select({ comment_left: 1, comment_right: 1, comment_content: 1, comment_parentId: 1 })
  //       .sort({ comment_left: 1 })

  //     return comments
  //   }

  //   const comments = await Comment.find({
  //     comment_productId: convertToObjectId(productId),
  //     comment_parentId: parentCommentId
  //   })
  //     .select({ comment_left: 1, comment_right: 1, comment_content: 1, comment_parentId: 1 })
  //     .sort({ comment_left: 1 })

  //   return comments
  // }

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
