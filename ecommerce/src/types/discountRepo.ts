import { ProductType } from '~/models/product.model'

export type DiscountInput = {
  name: string
  description: string
  type: string
  value: number
  code: string
  start_date: Date
  end_date: Date
  max_uses: number
  uses_count: number
  users_used: string[]
  max_uses_per_user: number
  min_order_value: number
  shopId: string
  is_active: boolean
  applies_to: string
  product_ids: string[]
  max_value: number
}

export type DiscountCodeParams = {
  codeId: string
  shopId: string
}

export type DiscountCodeCancel = {
  userId: string
} & DiscountCodeParams

export type DiscountAmountParams = {
  products: DiscountProduct[]
} & DiscountCodeCancel

export type DiscountCodeWithProduct = {
  limit: number
  page: number
} & DiscountCodeParams

export type TransformedQuery = {
  limit: number
  sort: string
  page: number
  filter: Record<string, unknown>
  select: string[]
  codeId: string
  shopId: string
}

export type DiscountProduct = {
  productId: string
  quantity: number
  price: number
}
