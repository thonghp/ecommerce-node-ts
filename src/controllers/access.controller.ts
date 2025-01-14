import { NextFunction, Request, Response } from 'express'
import { CREATED } from '~/core/success.response'
import AccessService from '~/services/access.service'

class AccessController {
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    new CREATED({
      message: 'Sign up successfully',
      metadata: await AccessService.signup(req.body)
    }).send(res)
  }
}

export default new AccessController()
