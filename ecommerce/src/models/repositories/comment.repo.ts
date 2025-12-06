import type { AddCommentParams, DeleteCommentParams, GetCommentsByIdParams } from '~/types/commentRepo'
import Comment from '../comment.model'
import { convertToObjectId } from '~/utils'
import { NotFoundError } from '~/core/error.response'
import { findProduct } from './product.repo'

const addComment = async ({ productId, userId, content, parentCommentId = null }: AddCommentParams) => {
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

const getCommentsByParentId = async ({
  productId,
  parentCommentId,
  limit,
  offset // skip
}: GetCommentsByIdParams) => {
  if (parentCommentId) {
    const parent = await Comment.findById(parentCommentId)
    if (!parent) {
      throw new NotFoundError('Not found comment for product')
    }

    const comments = await Comment.find({
      comment_productId: productId,
      comment_left: { $gt: parent.comment_left },
      comment_right: { $lte: parent.comment_right }
    })
      .select({ comment_left: 1, comment_right: 1, comment_content: 1, comment_parentId: 1 })
      .sort({ comment_left: 1 })

    return comments
  }

  const comments = await Comment.find({
    comment_productId: productId,
    comment_parentId: parentCommentId
  })
    .select({ comment_left: 1, comment_right: 1, comment_content: 1, comment_parentId: 1 })
    .sort({ comment_left: 1 })

  return comments
}

const deleteComments = async ({ commentId, productId }: DeleteCommentParams) => {
  const foundProduct = await findProduct({ product_id: productId })
  if (!foundProduct) {
    throw new NotFoundError('Product not found')
  }

  const comment = await Comment.findById(commentId)
  if (!comment) {
    throw new NotFoundError('Comment not found')
  }

  const leftValue = comment.comment_left
  const rightValue = comment.comment_right
  // tính width
  const width = rightValue - leftValue + 1
  // delete all children comments
  await Comment.deleteMany({
    comment_productId: convertToObjectId(productId),
    comment_left: { $gte: leftValue, $lte: rightValue }
  })

  // update all comments after the deleted comment
  await Comment.updateMany(
    {
      comment_productId: convertToObjectId(productId),
      comment_right: { $gt: rightValue }
    },
    {
      $inc: { comment_right: -width }
    }
  )

  await Comment.updateMany(
    {
      comment_productId: convertToObjectId(productId),
      comment_left: { $gt: rightValue }
    },
    {
      $inc: { comment_left: -width }
    }
  )

  return true
}

export { addComment, getCommentsByParentId, deleteComments }
