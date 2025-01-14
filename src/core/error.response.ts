import statusCode from '~/utils/statusCode'
import reasonPhrases from '~/utils/reasonPhrases'

class ErrorResponse extends Error {
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = reasonPhrases.BAD_REQUEST, status = statusCode.BAD_REQUEST) {
    super(message, status)
  }
}

export { ErrorResponse, BadRequestError }
