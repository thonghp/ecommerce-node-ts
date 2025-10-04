import type { NextFunction, Request, Response } from 'express'

import { CREATED, SuccessResponse } from '~/core/success.response'
import CartService from '~/services/cart.service'

class CartController {
  addToCart = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Create new cart success!',
      metadata: await CartService.addToCart(req.body)
    }).send(res)
  }

  listToCart = async (req: Request, res: Response, next: NextFunction) => {
    const queryParam = req.query.userId as string
    new CREATED({
      message: 'list cart success',
      metadata: await CartService.getListUserCart(queryParam)
    }).send(res)
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Update cart success!',
      metadata: await CartService.updateToCart(req.body)
    }).send(res)
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'deleted cart success',
      metadata: await CartService.deleteUserCart(req.body)
    }).send(res)
  }
}

export default new CartController()
