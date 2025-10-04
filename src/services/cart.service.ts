import cartModel, { CartDocument } from '~/models/cart.model'
import { NotFoundError } from '~/core/error.response'
import type { UpdateCart, UserCart, UserProduct } from '~/types/cartRepo'
import { getProductById } from '~/models/repositories/product.repo'
import {
  createUserCart,
  findUserCartById,
  removeUserCartProduct,
  updateUserCartQuantity
} from '~/models/repositories/cart.repo'

/*
 Add product to cart [user]
 Reduce product quantity [user]
 Increase product quantity [user]
 Get list to cart [user]
 Delete cart item [user]
*/

class CartService {
  /*
   userId,
   product: {
      productId,
      shopId,
      quantity,
      name,
      price
   }
  */
  static async addToCart({ userId, product }: UserCart) {
    const userCart: CartDocument | null = await cartModel.findOne({
      cart_userId: userId,
      cart_state: 'active'
    })

    // 1. Nếu chưa có giỏ hàng ==> tạo giỏ hàng
    if (!userCart) {
      return await createUserCart({ userId, product })
    }

    // 2. Nếu giỏ hàng rỗng ==> push sản phẩm đầu tiên
    // empty <=> length = 0
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product]

      return await userCart.save()
    }

    //  3. Giỏ hàng đã có sản phẩm
    const foundProduct = userCart.cart_products.findIndex((cart_product) => {
      return cart_product.productId.toString() === product.productId.toString()
    })

    // Sản phẩm mới thêm vào
    if (foundProduct < 0) {
      userCart.cart_products.push(product)

      return await userCart.save()
    } else {
      //  Sản phẩm đã có thì cập nhật số lượng
      return await updateUserCartQuantity({ userId, product })
    }
  }

  static async getListUserCart(userId: string) {
    return await findUserCartById(userId)
  }

  /*
    userId,
    shop_order_ids: [
      {
        shopid,
        item_products: [
          {
            quantity // số lượng sau khi update
            price
            oldquantity // số lượng trước khi update
            shopId
            productId
          }
        ],
        version
      }
    ]
  */
  // cập nhật số lượng sản phẩm chỉ áp dụng cho 1 sản phẩm
  static async updateToCart({ userId, shop_order_ids }: UpdateCart) {
    let result = null
    for (const itemProduct of shop_order_ids[0].item_products) {
      const { quantity, old_quantity, productId } = itemProduct

      // 1. check xem product này có không
      const foundProduct = await getProductById(productId)
      if (!foundProduct) {
        throw new NotFoundError(`Product ${productId} does not exist`)
      }

      // 2. check product này có đúng với shop truyền về không
      if (foundProduct.product_shop?.toString() !== shop_order_ids[0].shopId) {
        throw new NotFoundError(`Product ${productId} does not belong to this shop`)
      }

      if (quantity === 0) {
        result = await removeUserCartProduct({ userId, productId })
        await findUserCartById(userId)
      } else {
        result = await updateUserCartQuantity({
          userId,
          product: {
            productId,
            quantity: quantity - old_quantity
          }
        })
      }
    }

    return result
  }

  // Xoá các sản phẩm (items) trong cart chứ không xoá cart, cart vẫn dữ nguyên
  static async deleteUserCart({ userId, productId }: UserProduct) {
    return removeUserCartProduct({ userId, productId })
  }
}

export default CartService
