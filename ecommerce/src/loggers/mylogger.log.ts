import { createLogger, format, Logger, transports } from 'winston'
import 'winston-daily-rotate-file'
import { v4 as uuidv4 } from 'uuid'

interface LogParams {
  context?: string
  requestId?: string
  message?: string
  metadata?: Record<string, string | number>
}

type LogParamsInput = LogParams | [string, { requestId: string }, Record<string, string | number>]
class MyLogger {
  logger: Logger
  constructor() {
    const formatPrint = format.printf(({ level, message, context, requestId, timestamp, metadata }) => {
      return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(metadata)}`
    })
    this.logger = createLogger({
      format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatPrint),
      transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
          level: 'info',
          dirname: 'src/logs',
          filename: 'application-%DATE%.info.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '3d'
          // format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatPrint)
        }),
        new transports.DailyRotateFile({
          level: 'error',
          dirname: 'src/logs',
          filename: 'application-%DATE%.error.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '3d'
          // format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatPrint)
        })
      ]
    })
  }

  commonParams(params: LogParamsInput) {
    let context, req, metadata
    if (Array.isArray(params)) {
      ;[context, req, metadata] = params
    } else {
      context = params
    }

    const requestId = req?.requestId || uuidv4()

    return { context, requestId, metadata }
  }

  log(message: string, params: LogParamsInput) {
    const paramLog = this.commonParams(params)
    const logObject = Object.assign({ message }, paramLog)
    this.logger.info(logObject)
  }

  error(message: string, params: LogParamsInput) {
    const paramsLog = this.commonParams(params)
    const logObject = Object.assign({ message }, paramsLog)
    this.logger.error(logObject)
  }
}

export default new MyLogger()
