import { NextFunction, Request, Response } from 'express'
import { CREATED, SuccessResponse } from '~/core/success.response'
import AccessService from '~/services/access.service'

class AccessController {
  login = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Login successfully',
      metadata: await AccessService.login(req.body)
    }).send(res)
  }
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    new CREATED({
      message: 'Sign up successfully',
      metadata: await AccessService.signup(req.body)
    }).send(res)
  }
}

export default new AccessController()
