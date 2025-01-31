import { NextFunction, Request, Response } from 'express'
import { CREATED, SuccessResponse } from '~/core/success.response'
import ProductService from '~/services/product.service'
import { ProductType } from '~/types/product'
import { transformQueryProducts } from '~/utils/transformQuery'

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

  getAllDraftsForShop = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Get all drafts successfully',
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }

  getAllPublishedForShop = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Get all publishs successfully',
      metadata: await ProductService.findAllPublishsForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }

  publishProductByShop = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'publish product success!',
      metadata: await ProductService.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  unPublishProductByShop = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'unpublish product success!',
      metadata: await ProductService.unpublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  getListSearchProducts = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'get list search product success!',
      metadata: await ProductService.searchProduct(req.params.keySearch)
    }).send(res)
  }

  findAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    const queryParam = transformQueryProducts(req.query)
    new SuccessResponse({
      message: 'get list products success!',
      metadata: await ProductService.findAllProducts(queryParam)
    }).send(res)
  }

  findProduct = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'get product success!',
      metadata: await ProductService.findProduct({
        product_id: req.params.product_id
      })
    }).send(res)
  }
}

export default new ProductController()
