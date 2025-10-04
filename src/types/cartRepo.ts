export type UserCart = {
  userId: string
  product: {
    productId: string
    shopId?: string
    quantity: number
    name?: string
    price?: number
  }
}

export type UpdateCart = {
  userId: string
  shop_order_ids: {
    shopId: string
    item_products: {
      quantity: number
      price: number
      old_quantity: number
      productId: string
    }[]
    version: number
  }[]
}

export type UserProduct = {
  userId: string
  productId: string
}
