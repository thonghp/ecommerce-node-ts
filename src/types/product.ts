import { Types } from 'mongoose'

export type ElectronicType = {
  manufacturer: string
  model?: string
  color?: string
  product_shop: Types.ObjectId
}

export type ClothingType = {
  brand: string
  size?: string
  material?: string
  product_shop: Types.ObjectId
}

export type FurnitureType = {
  brand: string
  size?: string
  material?: string
  product_shop: Types.ObjectId
}

export type ProductType = {
  product_name: string
  product_thumb: string
  product_description?: string
  product_price: number
  product_quantity: number
  product_type: string
  product_shop: Types.ObjectId
  product_attributes: ElectronicType | ClothingType | FurnitureType
}
