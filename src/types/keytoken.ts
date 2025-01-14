import { Schema } from 'mongoose'

export type CreateKey = {
  user: Schema.Types.ObjectId
  privateKey: string
  publicKey: string
  refreshToken?: string
}

export type KeyInfo = CreateKey & {
  refreshTokenUsed: []
}
