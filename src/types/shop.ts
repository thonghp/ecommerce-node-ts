import { Schema } from 'mongoose'

export type User = {
  name: string
  email: string
  password: string
}

export type Shop = User & {
  _id: Schema.Types.ObjectId
  status: string
  verify: boolean
  roles: string[]
}
