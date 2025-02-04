import { Model, Types } from 'mongoose'
import { ClothingType, ProductType, ElectronicType, FurnitureType } from '~/models/product.model'

export type ProductQuery = {
  product_shop: Types.ObjectId
  isDraft?: boolean
  isPublished?: boolean
}

export type PaginationOptions = {
  query: ProductQuery
  limit: number
  skip: number
}

export type ProductPaginationPayload = ProductQuery & {
  limit?: number
  skip?: number
}

export type ProductActionPayload = {
  product_id: string
  product_shop: Types.ObjectId
}

export type FindAllProductsInput = {
  limit: number
  sort: string
  page: number
  filter: object
  select: string[]
}

export type UpdateProductInput = {
  product_id: string
  payload: object
  model: Model<ProductType | ClothingType | ElectronicType | FurnitureType>
  isNew?: boolean
}
