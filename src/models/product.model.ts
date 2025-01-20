import mongoose, { model, Schema } from 'mongoose'
import { ClothingType, ElectronicType, FurnitureType, ProductType } from '~/types/product'

const DOCUMENT_NAME_PRODUCT = 'Product'
const COLLECTION_NAME_PRODUCT = 'Products'

const DOCUMENT_NAME_CLOTHING = 'Clothing'
const COLLECTION_NAME_CLOTHING = 'Clothes'

const DOCUMENT_NAME_ELECTRONIC = 'Electronic'
const COLLECTION_NAME_ELECTRONIC = 'Electronics'

const DOCUMENT_NAME_FURNITURE = 'Furniture'
const COLLECTION_NAME_FURNITURE = 'Furnitures'

const productSchema = new Schema<ProductType>(
  {
    product_name: {
      type: String,
      required: true
    },
    product_thumb: {
      type: String,
      required: true
    },
    product_description: String,
    product_price: {
      type: Number,
      required: true
    },
    product_quantity: {
      type: Number,
      required: true
    },
    product_type: {
      type: String,
      required: true,
      enum: ['Clothing', 'Electronic', 'Furniture']
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME_PRODUCT
  }
)

const clothingSchema = new Schema<ClothingType>(
  {
    brand: {
      type: String,
      required: true
    },
    size: String,
    material: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME_CLOTHING
  }
)

const electronicSchema = new Schema<ElectronicType>(
  {
    manufacturer: {
      type: String,
      required: true
    },
    model: String,
    color: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME_ELECTRONIC
  }
)

const furnitureSchema = new Schema<FurnitureType>(
  {
    brand: {
      type: String,
      required: true
    },
    size: String,
    material: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME_FURNITURE
  }
)

const productModel = mongoose.models[DOCUMENT_NAME_PRODUCT] || model(DOCUMENT_NAME_PRODUCT, productSchema)
const clothingModel = mongoose.models[DOCUMENT_NAME_CLOTHING] || model(DOCUMENT_NAME_CLOTHING, clothingSchema)
const electronicModel = mongoose.models[DOCUMENT_NAME_ELECTRONIC] || model(DOCUMENT_NAME_ELECTRONIC, electronicSchema)
const furnitureModel = mongoose.models[DOCUMENT_NAME_FURNITURE] || model(DOCUMENT_NAME_FURNITURE, furnitureSchema)

export { productModel, clothingModel, electronicModel, furnitureModel }
