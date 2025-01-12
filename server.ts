import dotenv from 'dotenv'
import app from './src/app'
import { dev } from '~/configs/config.mongodb'

dotenv.config()

const { port } = dev['app']

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server closed')
  })
})
