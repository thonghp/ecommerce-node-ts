import { ApiKey } from './types/apikey'
import { KeyInfo } from './types/keytoken'
import { JwtUserPayload } from './types/jwtUserPayload'
import { ProductType } from './types/product'

declare global {
  namespace Express {
    interface Request {
      objKey: ApiKey
      refreshToken: string
      keyStore: KeyInfo
      user: JwtUserPayload
      body: ProductType | KeyInfo | unknown
    }
  }
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string
      DEV_DB_PORT: string
      DEV_DB_USER: string
      DEV_DB_PW: string
      DEV_DB_NAME: string
    }
  }
  // Error là interface toàn cục sẵn nên không cần sử dụng namespace
  interface Error {
    status: number
  }
}
