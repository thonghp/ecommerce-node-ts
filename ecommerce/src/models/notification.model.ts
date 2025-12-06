import mongoose, { model, Schema, Types, type InferSchemaType } from 'mongoose'

const DOCUMENT_NAME = 'Notifications'
const COLLECTION_NAME = 'notifications'

const notificationSchema = new Schema(
  {
    /*
      ORDER-001: Order success
      ORDER-002: Order fail
      PROMOTION-001: New promotion
      SHOP-001: New product by user following
    */
    noti_type: {
      type: String,
      enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'],
      required: true
    },
    noti_senderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Shop'
    },
    noti_receivedId: {
      type: Number,
      required: true
    },
    noti_content: {
      type: String,
      required: true
    },
    noti_options: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

export type NotificationComment = InferSchemaType<typeof notificationSchema> & { _id: Types.ObjectId }

const notificationModel = mongoose.models[DOCUMENT_NAME] || model(DOCUMENT_NAME, notificationSchema)

export default notificationModel
