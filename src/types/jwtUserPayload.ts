import { Types } from 'mongoose'

export type JwtUserPayload = {
  userId: Types.ObjectId
  email: string
}
