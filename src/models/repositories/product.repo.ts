import { SortOrder, Types } from 'mongoose'
import { FindAllProductsInput, PaginationOptions, ProductActionPayload, UpdateProductInput } from '~/types/productRepo'
import { getSelectData, unGetSelectData } from '~/utils'
import { productModel, ProductType } from '../product.model'

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

const findAllProducts = async ({ limit, sort, page, filter, select }: FindAllProductsInput) => {
  const skip = (page - 1) * limit
  const sortBy: { [key: string]: SortOrder } = sort === 'ctime' ? { _id: 1 } : { _id: -1 }
  const products = await productModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()

  return products
}

const findProduct = async ({ product_id, unselect }: { product_id: string; unselect: string[] }) => {
  return await productModel.findById(product_id).select(unGetSelectData(unselect))
}

const updateProductById = async ({ product_id, payload, model, isNew = true }: UpdateProductInput) => {
  return await model.findByIdAndUpdate(product_id, payload, { new: isNew })
}

export {
  findAllDraftsForShop,
  findAllProducts,
  findAllPublishsForShop,
  findProduct,
  publishProductByShop,
  searchProductByUser,
  unpublishProductByShop,
  updateProductById
}
