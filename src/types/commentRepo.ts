export type CommentParams = {
  productId: string
  userId: number
  content: string
  parentCommentId?: string | null
}
