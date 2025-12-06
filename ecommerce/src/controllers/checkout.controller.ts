import type { NextFunction, Request, Response } from 'express'

import { SuccessResponse } from '~/core/success.response'
import CheckoutService from '~/services/checkout.service'

class CheckoutController {
  checkoutReview = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Checkout review success!',
      metadata: await CheckoutService.checkoutReview(req.body)
    }).send(res)
  }
}

export default new CheckoutController()
