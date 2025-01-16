import { Types } from 'mongoose'

export type TokenPair = {
  accessToken: string
  refreshToken: string
}
export type TokenGenerationParams = {
  payload: {
    userId: Types.ObjectId
    email: string
  }
  privateKey: string
  publicKey: string
}
