import { Types } from 'mongoose'
import { productModel } from '../product.model'
import { ProductType } from '~/types/product'
import { PaginationOptions, ProductActionPayload } from '~/types/productRepo'

const findAllDraftsForShop = async ({ query, limit, skip }: PaginationOptions) => {
  return await queryProduct({ query, limit, skip })
}

const findAllPublishsForShop = async ({ query, limit, skip }: PaginationOptions) => {
  return await queryProduct({ query, limit, skip })
}

const queryProduct = async ({ query, limit, skip }: PaginationOptions) => {
  return await productModel
    .find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

const publishProductByShop = async ({ product_id, product_shop }: ProductActionPayload) => {
  const foundProduct = await productModel.findOne<ProductType>({
    _id: Types.ObjectId.createFromHexString(product_id),
    product_shop: product_shop
  })
  if (!foundProduct) return null

  const { modifiedCount } = await productModel.updateOne(
    { _id: foundProduct._id },
    { $set: { isDraft: false, isPublished: true } }
  )

  return modifiedCount
}

const unpublishProductByShop = async ({ product_id, product_shop }: ProductActionPayload) => {
  const foundProduct = await productModel.findOne<ProductType>({
    _id: Types.ObjectId.createFromHexString(product_id),
    product_shop: product_shop
  })
  if (!foundProduct) return null

  const { modifiedCount } = await productModel.updateOne(
    { _id: foundProduct._id },
    { $set: { isDraft: true, isPublished: false } }
  )

  return modifiedCount
}

const searchProductByUser = async (keySearch: string) => {
  // const regexSearch = new RegExp(keySearch)
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
  return results
}

export {
  findAllDraftsForShop,
  findAllPublishsForShop,
  publishProductByShop,
  unpublishProductByShop,
  searchProductByUser
}
