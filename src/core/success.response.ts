import { Response } from 'express'
import { ResponseParams } from '~/types/successResponse'
import reasonPhrases from '~/utils/reasonPhrases'
import statusCode from '~/utils/statusCode'

class SuccessResponse {
  message: string
  status: number
  reasonStatus: string
  metadata: object
  constructor({ message, status = statusCode.OK, reasonStatus = reasonPhrases.OK, metadata }: ResponseParams) {
    this.message = message || reasonStatus
    this.status = status
    this.metadata = metadata
    this.reasonStatus = reasonStatus
  }

  send(res: Response, headers = {}) {
    if (Object.keys(headers).length > 0) {
      res.set(headers)
    }
    return res.status(this.status).json(this)
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    status = statusCode.CREATED,
    reasonStatus = reasonPhrases.CREATED,
    metadata
  }: ResponseParams) {
    super({ message, status, reasonStatus, metadata })
  }
}

export { SuccessResponse, CREATED }
