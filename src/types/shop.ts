import { Types } from 'mongoose'

export type User = {
  name: string
  email: string
  password: string
}

export type Shop = User & {
  _id: Types.ObjectId
  status: string
  verify: boolean
  roles: string[]
}
