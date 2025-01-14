import mongoose, { model, Schema } from 'mongoose'
import { ApiKey } from '~/types/apikey'
const DOCUMENT_NAME = 'ApiKey'
const COLLECTION_NAME = 'ApiKeys'

// Người dùng sẽ add cái key này add vào header service kèm theo
const apiKeySchema = new Schema<ApiKey>(
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

const apiKeyModel = mongoose.models[DOCUMENT_NAME] || model(DOCUMENT_NAME, apiKeySchema)

export default apiKeyModel
