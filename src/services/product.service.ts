import { Types } from 'mongoose'
import { BadRequestError } from '~/core/error.response'
import { clothingModel, electronicmodel, productModel } from '~/models/product.model'
import { ClothingType, ElectronicType, ProductType } from '~/types/product'

// factory class
class ProductFactory {
  static async createProduct(type: string, payload: ProductType) {
    switch (type) {
      case 'Clothing':
        return await new Clothing(payload).createProduct()
      case 'Electronic':
        return await new Electronic(payload).createProduct()
      default:
        throw new BadRequestError(`Invalid product types ${type}`)
    }
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
  product_attributes: ClothingType | ElectronicType
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
  async createProduct(product_id: Types.ObjectId) {
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
    const newElectronic = await electronicmodel.create({
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

export default ProductFactory
