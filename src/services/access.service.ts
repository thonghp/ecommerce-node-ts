import { BadRequestError } from '~/core/error.response'
import shopModel from '~/models/shop.model'
import bycrypt from 'bcrypt'
import crypto from 'node:crypto'
import KeyTokenService from './keytoken.service'
import createTokenPair from '~/auth/authUtils'
import _ from 'lodash'
import { User } from '~/types/shop'

const RoleShop = {
  SHOP: 'SHOP', // ngoài thực tế người ta dùng là các con số như 0001 để đại diện cho role này
  EDITOR: 'EDITOR',
  WRITTER: 'WRITTER',
  ADMIN: 'ADMIN'
}

class AccessService {
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
}

export default AccessService
