import { ApiKeyType } from './models/apikey.model'
import { KeyTokenType } from './models/keytoken.model'
import { JwtUserPayload } from './types/jwtUserPayload'

declare global {
  namespace Express {
    interface Request {
      keyStore: KeyTokenType
      refreshToken: string
      user: JwtUserPayload
      objKey: ApiKeyType
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
