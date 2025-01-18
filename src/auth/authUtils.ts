import { NextFunction, Request, Response } from 'express'
import JWT from 'jsonwebtoken'
import { AuthFailureError, NotFoundError } from '~/core/error.response'
import asyncHandler from '~/helpers/asyncHandler'
import KeyTokenService from '~/services/keytoken.service'
import { TokenGenerationParams, TokenPair } from '~/types/token'
import { JwtUserPayload } from '~/types/jwtUserPayload'

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESHTOKEN: 'x-token-id'
}

/**
 * Get payload plus private key and public key to sign jwt to create access and refresh token pair
 */
const createTokenPair = async ({ payload, privateKey, publicKey }: TokenGenerationParams): Promise<TokenPair> => {
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
        console.log(`decode verify ${decode}`)
      }
    })

    return { accessToken, refreshToken }
  } catch (error) {
    console.error(`Error: ${error}`)
    throw error
  }
}

const authentication = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers[HEADER.CLIENT_ID] as string
  if (!userId) {
    throw new AuthFailureError('Invalid request')
  }

  const keyStore = await KeyTokenService.findByUserId(userId)
  if (!keyStore) {
    throw new NotFoundError('Not found keyStore')
  }

  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN] as string
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey) as JwtUserPayload
      if (userId !== decodeUser.userId.toString()) {
        throw new AuthFailureError('Invalid userId')
      }
      req.keyStore = keyStore
      req.user = decodeUser
      req.refreshToken = refreshToken
      return next()
    } catch (error) {
      console.error(`Error: ${error}`)
      throw error
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION] as string
  if (!accessToken) {
    throw new AuthFailureError('Invalid request')
  }

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey) as JwtUserPayload
    if (userId !== decodeUser.userId.toString()) {
      throw new AuthFailureError('Invalid userId')
    }
    req.keyStore = keyStore
    req.user = decodeUser
    return next()
  } catch (error) {
    console.error(`Error: ${error}`)
    throw error
  }
})

export { authentication, createTokenPair }
