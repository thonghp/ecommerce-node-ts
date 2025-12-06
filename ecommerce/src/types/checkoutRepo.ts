import { DiscountProduct } from './discountRepo'

export type CheckoutReviewParams = {
  cartId: string
  userId: string
  shop_order_ids: {
    shopId: string
    shop_discounts: {
      shopId: string
      discountId: string
      codeId: string
    }[]
    item_products: DiscountProduct[]
  }[]
}
