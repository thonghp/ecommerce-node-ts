import { type SortOrder } from 'mongoose'
import { DiscountProduct } from '~/types/discountRepo'
import type { FindAllParams, UnOrPublishProductParams, UpdateProductByIdParams } from '~/types/productRepo'
import { convertToObjectId, getSelectData, unGetSelectData } from '~/utils'
import { productModel, type ProductType } from '../product.model'

type QueryOptions = {
  query: Omit<Partial<ProductType>, 'product_shop'> & { product_shop?: string }
  limit: number
  skip: number
}

const findAllDraftsForShop = async ({ query, limit, skip }: QueryOptions) => {
  return await queryProduct({ query, limit, skip })
}

const findAllPublishsForShop = async ({ query, limit, skip }: QueryOptions) => {
  return await queryProduct({ query, limit, skip })
}

const queryProduct = async ({ query, limit, skip }: QueryOptions) => {
  return await productModel
    .find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updatedAt: -1 }) // mới nhất
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

const publishProductByShop = async ({ product_id, product_shop }: UnOrPublishProductParams) => {
  const foundProduct = await productModel
    .findOne<ProductType>({
      _id: convertToObjectId(product_id),
      product_shop: convertToObjectId(product_shop)
    })
    .lean()
    .exec()
  if (!foundProduct) {
    return null
  }

  const { modifiedCount } = await productModel.updateOne(
    { _id: foundProduct._id },
    { $set: { isDraft: false, isPublished: true } }
  )

  return modifiedCount
}

const unpublishProductByShop = async ({ product_id, product_shop }: UnOrPublishProductParams) => {
  const foundProduct = await productModel
    .findOne<ProductType>({
      _id: convertToObjectId(product_id),
      product_shop: convertToObjectId(product_shop)
    })
    .lean()
    .exec()
  if (!foundProduct) {
    return null
  }

  const { modifiedCount } = await productModel.updateOne(
    { _id: foundProduct._id },
    { $set: { isDraft: true, isPublished: false } }
  )

  return modifiedCount
}

const searchProductByUser = async (keySearch: string) => {
  const results = await productModel
    .find(
      {
        isPublished: true,
        $text: { $search: keySearch }
      },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .lean()
    .exec()

  return results
}

const findAllProducts = async ({ limit, sort, page, filter, select }: FindAllParams) => {
  const skip = (page - 1) * limit
  // bản thân _id cũng field string
  const sortBy: { [key: string]: SortOrder } = sort === 'ctime' ? { _id: 1 } : { _id: -1 }
  const products = await productModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select)) // mặc định _id khi nào cũng được select theo hết
    .lean()
    .exec()

  return products
}

const findProduct = async ({ product_id, unselect }: { product_id: string; unselect?: string[] }) => {
  return await productModel.findById(product_id).select(unGetSelectData(unselect)).lean().exec()
}

const updateProductById = async <T extends Document>({
  product_id,
  payload,
  model,
  isNew = true
}: UpdateProductByIdParams<T>) => {
  return await model.findByIdAndUpdate(product_id, payload, { new: isNew })
}

const getProductById = async (productId: string) => {
  return await productModel
    .findOne({ _id: convertToObjectId(productId) })
    .lean<ProductType>()
    .exec()
}

// Sử dụng promise all ở đây để nó chạy đồng thời chứ không đợi chạy tuần tự
const checkProductByServer = async (products: DiscountProduct[]) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductById(product.productId)
      if (foundProduct) {
        return {
          price: product.price,
          quantity: product.quantity,
          productId: product.productId
        }
      }
    })
  )
}

export {
  checkProductByServer,
  findAllDraftsForShop,
  findAllProducts,
  findAllPublishsForShop,
  findProduct,
  getProductById,
  publishProductByShop,
  searchProductByUser,
  unpublishProductByShop,
  updateProductById
}
