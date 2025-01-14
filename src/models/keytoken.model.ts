import mongoose, { model, Schema } from 'mongoose'
import { KeyInfo } from '~/types/keytoken'

const DOCUMENT_NAME = 'Key' // name of the model used when calling model
const COLLECTION_NAME = 'Keys' // name of the collection in mongodb

// Declare the Schema of the Mongo model
const keyTokenSchema = new Schema<KeyInfo>(
  {
    user: {
      type: Schema.Types.ObjectId, // reference to the user's objectid in the shop model
      required: true,
      ref: 'Shop' // reference to the document name of the shop model
    },
    privateKey: {
      type: String,
      required: true
    },
    publicKey: {
      type: String,
      required: true
    },
    refreshToken: {
      type: String,
      required: true
    },
    refreshTokenUsed: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true, // Automatically insert two is createdAt and updatedAt
    collection: COLLECTION_NAME // specify collection name instead of mongoose generated
  }
)

// Kiểm tra và tránh ghi đè model khi hot reload
const keyTokenModel = mongoose.models[DOCUMENT_NAME] || model(DOCUMENT_NAME, keyTokenSchema)

// Export the model
export default keyTokenModel
