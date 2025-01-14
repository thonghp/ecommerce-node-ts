import JWT from 'jsonwebtoken'
import { CreateTokenPair, TokenPair } from '~/types/authKey'

/**
 * Get payload plus private key and public key to sign jwt to create access and refresh token pair
 */

const createTokenPair = async ({ payload, privateKey, publicKey }: CreateTokenPair): Promise<TokenPair> => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: '2 days'
    })

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: '7 days'
    })

    JWT.verify(accessToken, publicKey, (error, decode) => {
      if (error) {
        console.error(`error verify ${error}`)
      } else {
        console.log(`decode verify ${JSON.stringify(decode, null, 2)}`);
      }
    })

    return { accessToken, refreshToken }
  } catch (error) {
    console.error(`Error: ${error}`)
    throw error
  }
}

export default createTokenPair
