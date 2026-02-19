import mongoose, { HydratedDocument, Model, model, Schema, Types, type InferSchemaType } from 'mongoose'

const DOCUMENT_NAME = 'Role'
const COLLECTION_NAME = 'roles'

const roleSchema = new Schema(
  {
    rol_name: {
      type: String,
      default: 'user',
      enum: ['user', 'admin', 'shop']
    },
    rol_slug: {
      type: String,
      required: true
    },
    rol_status: {
      type: String,
      default: 'active',
      enum: ['pending', 'active', 'block']
    },
    rol_description: {
      type: String,
      default: ''
    },
    rol_grants: [
      {
        resource: {
          type: Schema.Types.ObjectId,
          ref: 'Resource',
          required: true
        },
        action: [
          {
            type: String,
            required: true
          }
        ],
        attributes: {
          type: String,
          default: '*'
        }
      }
    ]
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

export type RoleType = InferSchemaType<typeof roleSchema> & {
  _id: Types.ObjectId
}
export type RoleDocument = HydratedDocument<RoleType>
const roleModel = (mongoose.models[DOCUMENT_NAME] || model<RoleType>(DOCUMENT_NAME, roleSchema)) as Model<RoleType>

export default roleModel
