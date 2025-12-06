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

class AuthFailureError extends ErrorResponse {
  constructor(message = reasonPhrases.UNAUTHORIZED, status = statusCode.UNAUTHORIZED) {
    super(message, status)
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message = reasonPhrases.NOT_FOUND, status = statusCode.NOT_FOUND) {
    super(message, status)
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(message = reasonPhrases.FORBIDDEN, status = statusCode.FORBIDDEN) {
    super(message, status)
  }
}

export { ErrorResponse, BadRequestError, AuthFailureError, NotFoundError, ForbiddenError }
