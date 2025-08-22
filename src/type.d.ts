import { ApiKeyType } from './models/apikey.model'
import { JwtUserPayload } from './types/jwtUserPayload'
import { KeyInfo } from './types/keytoken'

declare global {
  namespace Express {
    interface Request {
      objKey: ApiKeyType
      refreshToken: string
      keyStore: KeyInfo
      user: JwtUserPayload
      body: unknown
      params: string
    }
  }
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string | number
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
// đảm bảo đây là một module để ts đọc
export {}
