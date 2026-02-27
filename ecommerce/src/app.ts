import compression from 'compression'
import express, { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import router from './routers'
import { v4 as uuidv4 } from 'uuid'
import myLogger from '~/loggers/mylogger.log'

const app = express()

// init middlewares-------------------------------------------------------------
app.use(morgan('dev'))
app.use(compression())
app.use(helmet())

// convert json to object js
app.use(express.json()) // xử lý request với content type application/json
app.use(express.urlencoded({ extended: true })) // content type application/x-www-form-urlencoded

// log
app.use((req: Request, res: Response, next: NextFunction) => {
  // cái requestId này sẽ đi theo suốt quá trình xử lý request
  const requestId = req.headers['x-request-id'] as string
  req.requestId = requestId ? requestId : uuidv4()
  myLogger.log(`input params ::${req.method}`, [
    req.path,
    { requestId: req.requestId },
    req.method === 'POST' ? req.body : req.query
  ])
  next()
})

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
  next(error) // chuyển sang middleware ở dưới
})

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  // xử lý tất cả error
  const statusCode = error.status || 500
  const resMessage = `${error.status} - ${Date.now() - error.now}ms - Response: ${JSON.stringify(error)}`
  myLogger.error(resMessage, [req.path, { requestId: req.requestId }, { message: error.message }])

  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    // stack: error.stack, // dùng để log ra xem lỗi dòng bao nhiêu
    message: error.message || 'Internal Server Error'
  })
})

export default app
