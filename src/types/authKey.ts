import { Schema } from 'mongoose'

export type TokenPair = {
  accessToken: string
  refreshToken: string
}
export type CreateTokenPair = {
  payload: {
    userId: Schema.Types.ObjectId
    email: string
  }
  privateKey: string
  publicKey: string
}
