import { Types } from 'mongoose'

export type InventoryInput = {
  productId?: Types.ObjectId | null
  shopId?: Types.ObjectId | null
  location?: string
  stock: number
}
