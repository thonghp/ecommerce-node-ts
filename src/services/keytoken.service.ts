import keytokenModel from '../models/keytoken.model'
import { CreateKey, KeyInfo } from '../types/keytoken'

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
}

export default KeyTokenService
