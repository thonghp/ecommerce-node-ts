export type User = {
  name: string
  email: string
  password: string
}

export type Shop = User & {
  status: string
  verify: boolean
  roles: string[]
}
