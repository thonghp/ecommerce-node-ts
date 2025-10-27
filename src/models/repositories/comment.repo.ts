import type { CommentParams } from '~/types/commentRepo'
import Comment from '../comment.model'
import { convertToObjectId } from '~/utils'
import { NotFoundError } from '~/core/error.response'

const addComment = async ({ productId, userId, content, parentCommentId = null }: CommentParams) => {
  // hỏi xem cách này có tương tự cách insert xuống db không hay chỉ gán tạm vô xài
  const comment = new Comment({
    comment_productId: productId,
    comment_userId: userId,
    comment_content: content,
    comment_parentId: parentCommentId
  })

  let rightValue
  // Trường hợp reply comment của người khác
  if (parentCommentId) {
    const parentComment = await Comment.findById(parentCommentId)
    if (!parentComment) {
      throw new NotFoundError('Parent comment not found')
    }

    rightValue = parentComment.comment_right
    // update many comment
    await Comment.updateMany(
      {
        comment_productId: convertToObjectId(productId),
        comment_right: { $gte: rightValue }
      },
      {
        $inc: { comment_right: 2 }
      }
    )

    await Comment.updateMany(
      {
        comment_productId: convertToObjectId(productId),
        comment_left: { $gt: rightValue }
      },
      {
        $inc: { comment_left: 2 }
      }
    )
  } else {
    const maxRightValue = await Comment.findOne({ comment_productId: convertToObjectId(productId) }, 'comment_right', {
      sort: { comment_right: -1 }
    })
    if (maxRightValue) {
      rightValue = maxRightValue.comment_right + 1
    } else {
      rightValue = 1
    }
  }

  comment.comment_left = rightValue
  comment.comment_right = rightValue + 1
  await comment.save()

  return comment
}

export { addComment }
