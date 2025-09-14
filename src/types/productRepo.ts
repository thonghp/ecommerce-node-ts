import { Model, Types } from 'mongoose'

export type DraftsOrPublishParams = {
  product_shop: Types.ObjectId
  limit?: number
  skip?: number
}

export type ProductShopParams = {
  product_id: string
  product_shop: Types.ObjectId
}

export type FindAllProductParams = {
  limit: number
  sort: string
  page: number
  filter: Record<string, unknown>
  select: string[]
}

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
