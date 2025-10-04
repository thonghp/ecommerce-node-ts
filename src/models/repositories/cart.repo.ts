import type { UserCart, UserProduct } from '~/types/cartRepo'
import cartModel, { type CartType } from '../cart.model'

// tạo giỏ hàng nếu user đó chưa có giỏ hàng nào
const createUserCart = async ({ userId, product }: UserCart) => {
  const query = { cart_userId: userId, cart_state: 'active' },
    updateOrInsert = {
      $addToSet: {
        cart_products: product
      }
    },
    options = { upsert: true, new: true }

  return await cartModel.findOneAndUpdate(query, updateOrInsert, options)
}

const updateUserCartQuantity = async ({ userId, product }: UserCart) => {
  const { productId, quantity } = product
  const query = {
      cart_userId: userId,
      'cart_products.productId': productId,
      cart_state: 'active'
    },
    updateSet = {
      $inc: {
        'cart_products.$.quantity': quantity
      }
    },
    options = { upsert: true, new: true }

  return await cartModel.findOneAndUpdate(query, updateSet, options)
}

const findUserCartById = async (userId: string) => {
  return await cartModel.findOne({ cart_userId: userId }).lean<CartType>().exec()
}

const removeUserCartProduct = async ({ userId, productId }: UserProduct) => {
  const result = await cartModel.updateOne(
    { cart_userId: userId, cart_state: 'active' },
    { $pull: { cart_products: { productId } } }
  )

  if (result.modifiedCount === 0) {
    throw new Error(`Product ${productId} not found in user's cart`)
  }

  return { success: true }
}

export { removeUserCartProduct, findUserCartById, createUserCart, updateUserCartQuantity }
