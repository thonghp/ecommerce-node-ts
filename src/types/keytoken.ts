import { Types } from 'mongoose'

export type CreateKey = {
  user: Types.ObjectId
  privateKey: string
  publicKey: string
  refreshToken?: string
}

export type KeyInfo = CreateKey & {
  _id: Types.ObjectId
  refreshTokenUsed: string[]
}
