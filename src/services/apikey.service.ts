import crypto from 'node:crypto'
import apiKeyModel, { ApiKeyType } from '~/models/apikey.model'

const createXApiKey = async (): Promise<ApiKeyType> => {
  const newKey = await apiKeyModel.create({
    key: crypto.randomBytes(64).toString('hex'),
    permissions: ['0000']
  })

  return newKey
}

const findById = async (key: string): Promise<ApiKeyType | null> => {
  const objKey = await apiKeyModel.findOne({ key, status: true }).lean<ApiKeyType>().exec()

  return objKey
}

export { createXApiKey, findById }
