import { Model } from 'mongoose'
import { ProductType } from '~/models/product.model'

export type DraftsOrPublishParams = {
  product_shop: string
  limit?: number
  skip?: number
}
export type UnOrPublishProductParams = {
  product_id: string
  product_shop: string
}

export type FindAllProductParams = {
  limit: number
  sort: string
  page: number
  filter: Record<string, unknown>
  select: string[]
}

export type ProductInput = Omit<ProductType, 'product_shop'> & { product_shop?: string }

// cách này dùng khi ít loại model
// export type UpdateProductByIdParams = {
//   product_id: string
//   payload: object
//   model: Model<ProductType | ClothingType | ElectronicType | FurnitureType>
//   isNew?: boolean
// }

// cách này dùng khi ta muốn mở rộng nhiều model
export type UpdateProductByIdParams<T extends Document> = {
  product_id: string
  payload?: Record<string, unknown>
  model: Model<T>
  isNew?: boolean
}
