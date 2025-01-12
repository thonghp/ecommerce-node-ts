import dotenv from 'dotenv'

dotenv.config()

type DBConfig = {
  user: string
  pw: string
  dbname: string
}

interface AppConfig {
  port: string
}

type Config = {
  app: AppConfig
  db: DBConfig
}

export const dev: Config = {
  app: {
    port: process.env.PORT || '3055'
  },
  db: {
    user: process.env.DEV_DB_USER || '',
    pw: process.env.DEV_DB_PW || '',
    dbname: process.env.DEV_DB_NAME || ''
  }
}
