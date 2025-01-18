import { NextFunction, Request, Response } from 'express'
import { CREATED } from '~/core/success.response'
import ProductService from '~/services/product.service'
import { ProductType } from '~/types/product'

class ProductController {
  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const productData = req.body as ProductType
    new CREATED({
      message: 'Create new product success!',
      metadata: await ProductService.createProduct(productData.product_type, {
        ...productData,
        product_shop: req.user.userId
      })
    }).send(res)
  }
}

export default new ProductController()
