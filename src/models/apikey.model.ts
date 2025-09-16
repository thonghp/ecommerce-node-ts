import mongoose, { model, Schema, Types, type InferSchemaType } from 'mongoose'
const DOCUMENT_NAME = 'ApiKey'
const COLLECTION_NAME = 'ApiKeys'

// Người dùng sẽ add cái key này add vào header service kèm theo
const apiKeySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: Boolean,
      default: true
    },
    permissions: {
      type: [String],
      required: true,
      enum: ['0000', '1111', '2222']
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '30d'
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

type ApiKeySchemaType = InferSchemaType<typeof apiKeySchema>

export type ApiKeyType = ApiKeySchemaType & { _id: Types.ObjectId }

const apiKeyModel = mongoose.models[DOCUMENT_NAME] || model(DOCUMENT_NAME, apiKeySchema)

export default apiKeyModel
