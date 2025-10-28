export type AddCommentParams = {
  productId: string
  userId: number
  content: string
  parentCommentId: string | null
}

export type GetCommentsByIdParams = {
  productId: string
  parentCommentId: string | null
  limit: number
  offset: number
}
