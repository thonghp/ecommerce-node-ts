import shopModel, { type ShopType } from '~/models/shop.model'

type FindByEmailParams = {
  email: string
  select?: Record<string, number>
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
}: FindByEmailParams) => {
  return await shopModel.findOne({ email }).select(select).lean<ShopType>().exec()
}

export default findByEmail
