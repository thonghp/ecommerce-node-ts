import shopModel from '~/models/shop.model'
import { Shop } from '~/types/shop'

type FindUser = {
  id: number
  email: number
  password: number
  name: number
  status: number
  roles: number
}

const findByEmail = async ({
  email,
  select = {
    id: 1,
    email: 1,
    password: 1,
    name: 1,
    status: 1,
    roles: 1
  }
}: {
  email: string
  select?: FindUser
}): Promise<Shop | null> => {
  return await shopModel.findOne({ email }).select(select).lean<Shop>().exec()
}

export default findByEmail
