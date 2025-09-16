import mongoose, { model, Schema, Types, type InferSchemaType } from 'mongoose'
import slugify from 'slugify'

const DOCUMENT_NAME_PRODUCT = 'Product'
const COLLECTION_NAME_PRODUCT = 'Products'

const DOCUMENT_NAME_CLOTHING = 'Clothing'
const COLLECTION_NAME_CLOTHING = 'Clothes'

const DOCUMENT_NAME_ELECTRONIC = 'Electronic'
const COLLECTION_NAME_ELECTRONIC = 'Electronics'

const DOCUMENT_NAME_FURNITURE = 'Furniture'
const COLLECTION_NAME_FURNITURE = 'Furnitures'

const productSchema = new Schema(
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
    product_slug: String,
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
    },
    product_ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val: number) => Math.round(val * 10) / 10
    },
    product_variations: {
      type: Array,
      default: []
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME_PRODUCT
  }
)

// Document middleware, run before save and create
productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true })
  next()
})

// run before update
productSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() as ProductType

  if (update.product_name) {
    update.product_slug = slugify(update.product_name, { lower: true })
    this.setUpdate(update)
  }

  next()
})

// Create index for full text search
productSchema.index({ product_name: 'text', product_description: 'text' })

const clothingSchema = new Schema(
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

const electronicSchema = new Schema(
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

const furnitureSchema = new Schema(
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

export type ProductType = InferSchemaType<typeof productSchema> & { _id: Types.ObjectId }
export type ClothingType = InferSchemaType<typeof clothingSchema> & { _id: Types.ObjectId }
export type ElectronicType = InferSchemaType<typeof electronicSchema> & { _id: Types.ObjectId }
export type FurnitureType = InferSchemaType<typeof furnitureSchema> & { _id: Types.ObjectId }

const productModel = mongoose.models[DOCUMENT_NAME_PRODUCT] || model(DOCUMENT_NAME_PRODUCT, productSchema)
const clothingModel = mongoose.models[DOCUMENT_NAME_CLOTHING] || model(DOCUMENT_NAME_CLOTHING, clothingSchema)
const electronicModel = mongoose.models[DOCUMENT_NAME_ELECTRONIC] || model(DOCUMENT_NAME_ELECTRONIC, electronicSchema)
const furnitureModel = mongoose.models[DOCUMENT_NAME_FURNITURE] || model(DOCUMENT_NAME_FURNITURE, furnitureSchema)

export { clothingModel, electronicModel, furnitureModel, productModel }
