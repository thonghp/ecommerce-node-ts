import { Types } from 'mongoose'
import { BadRequestError } from '~/core/error.response'
import {
  clothingModel,
  ClothingType,
  electronicModel,
  ElectronicType,
  furnitureModel,
  FurnitureType,
  productModel,
  ProductType
} from '~/models/product.model'
import { insertInventory } from '~/models/repositories/inventory.repo'
import {
  findAllDraftsForShop,
  findAllProducts,
  findAllPublishsForShop,
  findProduct,
  publishProductByShop,
  searchProductByUser,
  unpublishProductByShop,
  updateProductById
} from '~/models/repositories/product.repo'
import { DraftsOrPublishParams, FindAllProductParams, ProductShopParams } from '~/types/productRepo'
import { sanitizeAndFlatten } from '~/utils'

// type constructor, type này bắt buộc khi new constructor phải giống như vậy, kể cả lớp con kế thừa
type classRefType = new (payload: ProductType) => Product
// ================= STRATEGY ===================
class ProductStrategy {
  // Cách này nhanh gọn không quan tâm lớp con new constructor thế nào
  // static productRegistry: Record<string, typeof Product> = {}

  // registry này là 1 object có key là tên còn value là 1 class
  static productRegistry: Record<string, classRefType> = {}

  // Hàm này dùng để thêm vào trong registry
  static registerProductType(type: string, classRef: classRefType) {
    ProductStrategy.productRegistry[type] = classRef
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
    const productClass = ProductStrategy.productRegistry[type]
    if (!productClass) {
      throw new BadRequestError(`Invalid product types ${type}`)
    }

    return new productClass(payload).createProduct()
  }

  static async updateProduct(type: string, product_id: string, payload: ProductType) {
    const productClass = ProductStrategy.productRegistry[type]
    if (!productClass) {
      throw new BadRequestError(`Invalid product types ${type}`)
    }

    return new productClass(payload).updateProduct(product_id)
  }

  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }: DraftsOrPublishParams) {
    const query = { product_shop, isDraft: true }

    return await findAllDraftsForShop({ query, limit, skip })
  }

  static async findAllPublishsForShop({ product_shop, limit = 50, skip = 0 }: DraftsOrPublishParams) {
    const query = { product_shop, isPublished: true }

    return await findAllPublishsForShop({ query, limit, skip })
  }

  static async publishProductByShop({ product_id, product_shop }: ProductShopParams) {
    return await publishProductByShop({ product_id, product_shop })
  }

  static async unpublishProductByShop({ product_id, product_shop }: ProductShopParams) {
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
    select = ['product_name', 'product_price', 'product_thumb']
  }: FindAllProductParams) {
    return await findAllProducts({ limit, sort, page, filter, select })
  }

  static async findProduct(product_id: string) {
    return await findProduct({ product_id, unselect: ['__v'] })
  }
}

// ================= BASE CLASS ===================
class Product {
  product_name: string
  product_thumb: string
  product_description?: string | null
  product_price: number
  product_type: string
  product_shop?: Types.ObjectId | null
  product_attributes: ClothingType | ElectronicType | FurnitureType
  product_quantity: number
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_type,
    product_shop,
    product_attributes,
    product_quantity
  }: ProductType) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
    this.product_quantity = product_quantity
  }

  async createProduct(product_id?: Types.ObjectId) {
    const newProduct: ProductType = await productModel.create({ ...this, _id: product_id })
    if (newProduct) {
      // add product_stock in inventory
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity
      })
    }

    return newProduct
  }

  async updateProduct(product_id: string, payload?: Record<string, unknown>) {
    return await updateProductById({ product_id, payload, model: productModel })
  }
}

// define sub-class
class Clothing extends Product {
  async createProduct() {
    const newClothing: ClothingType = await clothingModel.create({
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

  async updateProduct(product_id: string) {
    const payload = sanitizeAndFlatten(this)
    const updateProduct = await super.updateProduct(product_id, payload)

    return updateProduct
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic: ElectronicType = await electronicModel.create({
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

  async updateProduct(product_id: string) {
    const payload = sanitizeAndFlatten(this)
    const updateProduct = await super.updateProduct(product_id, payload)

    return updateProduct
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture: FurnitureType = await furnitureModel.create({
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

  async updateProduct(product_id: string) {
    const payload = sanitizeAndFlatten(this)
    const updateProduct = await super.updateProduct(product_id, payload)

    return updateProduct
  }
}

// Đăng ký các class vô registry
ProductStrategy.registerProductType('Clothing', Clothing)
ProductStrategy.registerProductType('Electronic', Electronic)
ProductStrategy.registerProductType('Furniture', Furniture)

export default ProductStrategy
