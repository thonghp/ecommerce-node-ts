import mongoose, { HydratedDocument, model, Schema, Types, type InferSchemaType } from 'mongoose'

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'carts'

const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ['active', 'completed', 'failed', 'pending'],
      default: 'active'
    },
    cart_products: {
      type: Array,
      required: true,
      default: []
    },
    cart_count_product: {
      type: Number,
      default: 0
    },
    cart_userId: {
      type: Number,
      required: true
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: 'createdOn',
      updatedAt: 'modifiedOn'
    }
  }
)

export type CartType = InferSchemaType<typeof cartSchema> & {
  _id: Types.ObjectId
}
export type CartDocument = HydratedDocument<CartType>
const cartModel = mongoose.models[DOCUMENT_NAME] || model(DOCUMENT_NAME, cartSchema)

export default cartModel
