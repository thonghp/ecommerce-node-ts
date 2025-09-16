import { Types } from 'mongoose'
import keytokenModel, { type KeyTokenType } from '~/models/keytoken.model'
import { convertToObjectId } from '~/utils'

type CreateKey = {
  user: Types.ObjectId
  privateKey: string
  publicKey: string
  refreshToken?: string
}

class KeyTokenService {
  /**
   * Save user information, private key, public key and refresh token to db then return public key
   */
  static createKeyToken = async ({ user, publicKey, privateKey, refreshToken }: CreateKey) => {
    try {
      const filter = { user },
        update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken },
        options = { upsert: true, new: true }
      /*
       * upsert true => nếu userId không tồn tại => create, có rồi => update
       * new true => trả về document sau khi update or create, mặc định là trả về document trước update
       */
      const tokens = await keytokenModel.findOneAndUpdate(filter, update, options).lean<KeyTokenType>().exec()

      return tokens ? tokens.publicKey : null
    } catch (error) {
      console.error(`Error: ${error}`)
      throw error
    }
  }

  static findByUserId = async (userId: string) => {
    return await keytokenModel
      .findOne({ user: Types.ObjectId.createFromHexString(userId) })
      .lean<KeyTokenType>()
      .exec()
  }

  static removeKeyById = async (id: Types.ObjectId) => {
    const delKey = await keytokenModel.deleteOne({ _id: id })

    return delKey
  }

  static findByRefeshTokenUsed = async (refreshToken: string) => {
    return await keytokenModel.findOne({ refreshTokenUsed: refreshToken }).lean<KeyTokenType>().exec()
  }

  static deleteByUserId = async (userId: string) => {
    return await keytokenModel.deleteOne({ user: convertToObjectId(userId) })
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
