import mongoose, { HydratedDocument, Model, model, Schema, Types, type InferSchemaType } from 'mongoose'

const DOCUMENT_NAME = 'Resource'
const COLLECTION_NAME = 'resources'

const resourceSchema = new Schema(
  {
    src_name: {
      type: String,
      required: true
    },
    src_slug: {
      type: String,
      required: true
    },
    src_description: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

export type ResourceType = InferSchemaType<typeof resourceSchema> & {
  _id: Types.ObjectId
}
export type ResourceDocument = HydratedDocument<ResourceType>
const resourceModel = (mongoose.models[DOCUMENT_NAME] ||
  model<ResourceType>(DOCUMENT_NAME, resourceSchema)) as Model<ResourceType>

export default resourceModel
