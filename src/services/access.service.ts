import bycrypt from 'bcrypt'
import _ from 'lodash'
import crypto from 'node:crypto'
import { createTokenPair } from '~/auth/authUtils'
import { AuthFailureError, BadRequestError, ForbiddenError } from '~/core/error.response'
import { KeyTokenType } from '~/models/keytoken.model'
import shopModel from '~/models/shop.model'
import { JwtUserPayload } from '~/types/jwtUserPayload'
import { createXApiKey } from './apikey.service'
import KeyTokenService from './keytoken.service'
import findByEmail from './shop.service'

const RoleShop = {
  SHOP: 'SHOP', // ngoài thực tế người ta dùng là các con số như 0001 để đại diện cho role này
  EDITOR: 'EDITOR',
  WRITTER: 'WRITTER',
  ADMIN: 'ADMIN'
}

type User = {
  name: string
  email: string
  password: string
}

type HandleRefreshTokenParams = {
  keyStore: KeyTokenType
  user: JwtUserPayload
  refreshToken: string
}

class AccessService {
  static handleRefreshToken = async ({ keyStore, user, refreshToken }: HandleRefreshTokenParams) => {
    const { userId, email } = user
    // nếu refreshToken đã dùng => nghi ngờ bị hack => xóa keyStore
    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.deleteByUserId(userId)
      throw new ForbiddenError('Something wrong happened !! Pls re-login')
    }

    // refreshToken hiện tại không khớp => invalid
    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError('Invalid token')
    }

    const isExistingUser = await findByEmail({ email })
    if (!isExistingUser) {
      throw new AuthFailureError('Shop not registered')
    }

    const tokens = await createTokenPair({
      payload: { userId, email },
      privateKey: keyStore.privateKey,
      publicKey: keyStore.publicKey
    })
    await KeyTokenService.updateRefreshToken(keyStore._id, tokens.refreshToken, refreshToken)

    return {
      user,
      tokens
    }
  }

  static logout = async (keyStore: KeyTokenType) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id)

    return delKey
  }

  static login = async ({
    email,
    password
    // refreshToken = null
  }: {
    email: string
    password: string
    // refreshToken?: string
  }) => {
    const isExistingUser = await findByEmail({ email })
    if (!isExistingUser) {
      throw new BadRequestError('Email not registered')
    }

    const isPassword = bycrypt.compare(password, isExistingUser.password)
    if (!isPassword) {
      throw new AuthFailureError('Authentication error')
    }

    const { _id: userId } = isExistingUser
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')
    const tokens = await createTokenPair({
      payload: { userId, email },
      privateKey,
      publicKey
    })

    await KeyTokenService.createKeyToken({
      user: userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken
    })

    return {
      shop: _.pick(isExistingUser, ['id', 'name', 'email']),
      tokens
    }
  }

  static signup = async ({ name, email, password }: User) => {
    const isExistingUser = await shopModel.findOne({ email }).lean()
    if (isExistingUser) {
      throw new BadRequestError('Email already exists')
    }

    const passwordHash = await bycrypt.hash(password, 10)
    const newUser = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP]
    })

    if (newUser) {
      const privateKey = crypto.randomBytes(64).toString('hex')
      const publicKey = crypto.randomBytes(64).toString('hex')
      const keyStored = await KeyTokenService.createKeyToken({
        user: newUser._id,
        publicKey,
        privateKey
      })

      if (!keyStored) {
        return {
          code: 'xxx',
          message: 'keystore error'
        }
      }

      const tokens = await createTokenPair({
        payload: { userId: newUser._id, email },
        publicKey,
        privateKey
      })

      return {
        code: 201,
        metadata: {
          shop: _.pick(newUser, ['_id', 'name', 'email']),
          tokens
        }
      }
    }

    return {
      code: 200,
      metadata: null
    }
  }

  static generateApiKey = async () => {
    return await createXApiKey()
  }
}

export default AccessService
