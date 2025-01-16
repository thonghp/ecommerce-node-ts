import { Types } from 'mongoose'
import keytokenModel from '~/models/keytoken.model'
import { CreateKey, KeyInfo } from '~/types/keytoken'

class KeyTokenService {
  /**
   * Save user information, private key, public key and refresh token to db then return public key
   */
  static createKeyToken = async ({ user, publicKey, privateKey, refreshToken }: CreateKey): Promise<string | null> => {
    try {
      const filter = { user },
        update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken },
        options = { upsert: true, new: true }
      /*
       * upsert true => nếu userId không tồn tại => create, có rồi => update
       * new true => trả về document sau khi update or create, mặc định là trả về document trước update
       */
      const tokens = await keytokenModel.findOneAndUpdate<KeyInfo>(filter, update, options)
      return tokens ? tokens.publicKey : null
    } catch (error) {
      console.error(`Error: ${error}`)
      throw error
    }
  }

  static findByUserId = async (userId: string) => {
    return await keytokenModel
      .findOne({ user: Types.ObjectId.createFromHexString(userId) })
      .lean<KeyInfo>()
      .exec()
  }

  static removeKeyById = async (id: Types.ObjectId) => {
    const delKey = await keytokenModel.deleteOne({ _id: id })

    return delKey
  }

  static findByRefreshToken = async (refreshToken: string): Promise<KeyInfo | null> => {
    return await keytokenModel.findOne({ refreshToken })
  }

  static findRefeshTokenUsed = async (refreshToken: string): Promise<KeyInfo | null> => {
    return await keytokenModel.findOne({ refreshTokenUsed: refreshToken }).lean<KeyInfo>()
  }

  static deleteByUserId = async (userId: Types.ObjectId) => {
    return await keytokenModel.deleteOne({ user: userId })
  }

  static updateRefreshToken = async (id: Types.ObjectId, refreshToken: string, refreshTokenUsed: string) => {
    return await keytokenModel.updateOne(
      {
        _id: id
      },
      {
        $set: { refreshToken },
        $addToSet: { refreshTokenUsed }
      }
    )
  }
}

export default KeyTokenService
