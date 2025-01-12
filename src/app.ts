import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

const app = express()

// init middlewares-------------------------------------------------------------
app.use(morgan('dev'))
// @ts-expect-error ignore
app.use(compression())
app.use(helmet())

// init db----------------------------------------------------------------------
import './dbs/init.mongodb'
// import { checkOverload } from './helpers/check.connect'
// checkOverload()

// convert json to object js
app.use(express.json()) // xử lý request với content type application/json
app.use(express.urlencoded({ extended: true })) // content type application/x-www-form-urlencoded

export default app
