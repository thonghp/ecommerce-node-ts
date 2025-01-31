import { Types } from 'mongoose'
import { BadRequestError } from '~/core/error.response'
import { clothingModel, electronicModel, furnitureModel, productModel } from '~/models/product.model'
import {
  findAllDraftsForShop,
  findAllProducts,
  findAllPublishsForShop,
  findProduct,
  publishProductByShop,
  searchProductByUser,
  unpublishProductByShop
} from '~/models/repositories/product.repo'
import { ClothingType, ElectronicType, FurnitureType, ProductType } from '~/types/product'
import { FindAllProductsInput, ProductActionPayload, ProductPaginationPayload } from '~/types/productRepo'

// Stratogy class
type classRefType = new (payload: ProductType) => Product
class ProductFactoryStrategy {
  static productRegistry: Record<string, classRefType> = {}

  static registerProductType(type: string, classRef: classRefType) {
    ProductFactoryStrategy.productRegistry[type] = classRef
  }
  static async createProduct(type: string, payload: ProductType) {
    // switch (type) {
    //   case 'Clothing':
    //     return await new Clothing(payload).createProduct()
    //   case 'Electronic':
    //     return await new Electronic(payload).createProduct()
    //   default:
    //     throw new BadRequestError(`Invalid product types ${type}`)
    // }
    const productClass = ProductFactoryStrategy.productRegistry[type]
    if (!productClass) {
      throw new BadRequestError(`Invalid product types ${type}`)
    }
    return new productClass(payload).createProduct()
  }

  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }: ProductPaginationPayload) {
    const query = { product_shop, isDraft: true }
    return await findAllDraftsForShop({ query, limit, skip })
  }

  static async findAllPublishsForShop({ product_shop, limit = 50, skip = 0 }: ProductPaginationPayload) {
    const query = { product_shop, isPublished: true }
    return await findAllPublishsForShop({ query, limit, skip })
  }

  static async publishProductByShop({ product_id, product_shop }: ProductActionPayload) {
    return await publishProductByShop({ product_id, product_shop })
  }

  static async unpublishProductByShop({ product_id, product_shop }: ProductActionPayload) {
    return await unpublishProductByShop({ product_id, product_shop })
  }

  static async searchProduct(keySearch: string) {
    return await searchProductByUser(keySearch)
  }

  static async findAllProducts({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = { isPubished: true },
    select = []
  }: FindAllProductsInput) {
    return await findAllProducts({ limit, sort, page, filter, select })
  }

  static async findProduct({ product_id }: { product_id: string }) {
    return await findProduct({ product_id, unselect: ['__v'] })
  }
}

// base class
class Product {
  product_name: string
  product_thumb: string
  product_description?: string
  product_price: number
  product_quantity: number
  product_type: string
  product_shop: Types.ObjectId
  product_attributes: ClothingType | ElectronicType | FurnitureType
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes
  }: ProductType) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
  }
  async createProduct(product_id?: Types.ObjectId): Promise<ProductType> {
    return await productModel.create({
      ...this,
      _id: product_id
    })
  }
}

// define sub-class
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })

    if (!newClothing) {
      throw new BadRequestError('create new clothing error!')
    }

    const newProduct = await super.createProduct(newClothing._id)
    if (!newProduct) {
      throw new BadRequestError('create new product error!')
    }

    return newProduct
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronicModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })

    if (!newElectronic) {
      throw new BadRequestError('create new electronic error!')
    }

    const newProduct = await super.createProduct(newElectronic._id)
    if (!newProduct) {
      throw new BadRequestError('create new product error!')
    }

    return newProduct
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furnitureModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })

    if (!newFurniture) {
      throw new BadRequestError('create new furniture error!')
    }

    const newProduct = await super.createProduct(newFurniture._id)
    if (!newProduct) {
      throw new BadRequestError('create new product error!')
    }

    return newProduct
  }
}

ProductFactoryStrategy.registerProductType('Clothing', Clothing)
ProductFactoryStrategy.registerProductType('Electronic', Electronic)
ProductFactoryStrategy.registerProductType('Furniture', Furniture)

export default ProductFactoryStrategy
