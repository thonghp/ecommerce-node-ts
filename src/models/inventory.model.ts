import mongoose, { model, Schema, Types, type InferSchemaType } from 'mongoose'

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

const inventorySchema = new Schema(
  {
    inven_productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    inven_location: {
      type: String,
      default: 'unknown'
    },
    inven_stock: {
      type: Number,
      require: true
    },
    inven_shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    },
    inven_reservations: {
      type: Array,
      default: []
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

export type InventoryType = InferSchemaType<typeof inventorySchema> & {
  _id: Types.ObjectId
}

const inventoryModel = mongoose.models[DOCUMENT_NAME] || model(DOCUMENT_NAME, inventorySchema)

export default inventoryModel
