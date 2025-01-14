import compression from 'compression'
import express, { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import router from './routers'

const app = express()

// init middlewares-------------------------------------------------------------
app.use(morgan('dev'))
// @ts-expect-error ignore
app.use(compression())
app.use(helmet())

// convert json to object js
app.use(express.json()) // xử lý request với content type application/json
app.use(express.urlencoded({ extended: true })) // content type application/x-www-form-urlencoded

// init db----------------------------------------------------------------------
import './dbs/init.mongodb'
// import { checkOverload } from './helpers/check.connect'
// checkOverload()

// init routes------------------------------------------------------------------
app.use('/', router)

// handling error---------------------------------------------------------------
app.use((req: Request, res: Response, next: NextFunction) => {
  // tạo error 404 xử lý không có route nào khớp
  const error = new Error('Not found')
  error.status = 404
  next(error) // chuyển sang middleware xử lý error
})

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  // xử lý đọc error (bao gồm error ở trên)
  const statusCode = error.status || 500
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    // stack: error.stack, // dùng để log ra xem lỗi dòng bao nhiêu
    message: error.message || 'Internal Server Error'
  })
})

export default app
