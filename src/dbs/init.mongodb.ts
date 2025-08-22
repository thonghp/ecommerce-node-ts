import mongoose from 'mongoose'
import { countConnect } from '../helpers/check.connect'
import { dev } from '~/configs/config.mongodb'

const { user, pw, dbname } = dev['db']
// const connectString = `mongodb+srv://${user}:${pw}@cluster0demo.vn9ld.mongodb.net/${dbname}`
const connectString = `mongodb://localhost:27017/${dbname}`
class Database {
  // Là null thì sẽ gán giá trị ban đầu, nếu ta không sử dụng thì trường hợp null nó sẽ hiểu là undefined
  private static instance: Database | null = null
  private constructor() {
    this.connect()
  }
  // type = 'mongodb' sau này muốn xài db khác thì thay type
  connect(type: string = 'mongodb'): void {
    const isMongodb = type === 'mongodb'
    if (isMongodb) {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }

    mongoose
      .connect(connectString, { maxPoolSize: 50 })
      .then((_) => {
        countConnect()
      })
      .catch((err) => console.log(`Error connect to database: ${err}`))
  }
  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }

    return Database.instance
  }
}

export default Database.getInstance()
