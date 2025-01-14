import crypto from 'node:crypto'
import apiKeyModel from '~/models/apikey.model'
import { ApiKey } from '~/types/apikey'

const createXApiKey = async (): Promise<ApiKey> => {
  const newKey = await apiKeyModel.create({
    key: crypto.randomBytes(64).toString('hex'),
    permissions: ['0000']
  })
  // console.log(newKey) // để test, thường key này do đối tác tạo trước
  return newKey
}

const findById = async (key: string): Promise<ApiKey | null> => {
  const objKey = await apiKeyModel.findOne({ key, status: true }).lean<ApiKey>()

  return objKey
}

export { createXApiKey, findById }
