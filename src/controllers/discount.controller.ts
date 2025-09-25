import type { NextFunction, Request, Response } from 'express'
import { ParsedQs } from 'qs'
import { CREATED, SuccessResponse } from '~/core/success.response'
import DiscountService from '~/services/discount.service'
import { DiscountInput } from '~/types/discountRepo'
import { transformQuery, transformQueryAllDiscounts } from '~/utils/transformQuery'

class DiscountController {
  createDiscountCode = async (req: Request, res: Response, next: NextFunction) => {
    new CREATED({
      message: 'Create new discount code success!',
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId
      })
    }).send(res)
  }

  getAllDiscountCodesByShop = async (req: Request, res: Response, next: NextFunction) => {
    const queryParam = transformQuery(req.query, { discount_shopId: req.user.userId, discount_is_active: true }, [
      'discount_code',
      'discount_name'
    ])

    new SuccessResponse({
      message: 'Get list discount code success!',
      metadata: await DiscountService.getAllDiscountCodesByShop(queryParam)
    }).send(res)
  }

  updateDiscount = async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body as DiscountInput
    new SuccessResponse({
      message: 'update discount success!',
      metadata: await DiscountService.updateDiscount(req.params.discountId, {
        ...payload,
        shopId: req.user.userId
      })
    }).send(res)
  }

  getAllDiscountCodesWithProducts = async (req: Request, res: Response, next: NextFunction) => {
    const queryParam = transformQueryAllDiscounts(req.query)
    new SuccessResponse({
      message: 'Get list discount code success!',
      metadata: await DiscountService.getAllDiscountCodesWithProduct(queryParam)
    }).send(res)
  }

  getDiscountAmount = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Get list discount code success!',
      metadata: await DiscountService.getDiscountAmount({
        ...req.body
      })
    }).send(res)
  }
}

export default new DiscountController()
