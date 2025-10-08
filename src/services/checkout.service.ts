import { BadRequestError, NotFoundError } from '~/core/error.response'
import { findCartById } from '~/models/repositories/cart.repo'
import { checkProductByServer } from '~/models/repositories/product.repo'
import DiscountService from './discount.service'
import { CheckoutReviewParams } from '~/types/checkoutRepo'
import { DiscountProduct } from '~/types/discountRepo'

class CheckoutService {
  /*
    Trong đây chỉ áp dụng trường hợp mã discount hệ thống sẽ cung cấp và user chọn nên sẽ tồn tại sẵn discountId, còn trường hợp người dùng nhập chay thì không có discountId khi call postman
    cartId,
    userId,
    shop_order_ids: [
      {
        shopId,
        shop_discounts: [],
        item_products: [
          {
            price
            quantity // số lượng sau khi update
            productId
          }
        ]
      },
      {
        shopId,
        shop_discounts: [
          {
            shopId,
            discountId,
            codeId
          }
        ],
        item_products: [
          {
            price
            quantity // số lượng sau khi update
            productId
          }
        ]
      }
    ]
  */
  // review giỏ hàng trước khi order, lúc review ko thể tăng số lượng của sản phẩm
  static async checkoutReview({ cartId, userId, shop_order_ids }: CheckoutReviewParams) {
    // B1: check xem giỏ hàng có tồn tai không
    const foundCart = await findCartById(cartId)

    if (!foundCart) {
      throw new NotFoundError('Cart do not exit')
    }

    const checkout_order = {
        totalPrice: 0, // tiền ban đầu
        totalDiscount: 0, // tiền giảm giá
        feeShip: 0,
        totalCheckout: 0 // tiền sau cùng = totalPrice - totalDiscount
      },
      shop_order_ids_new = []

    // B2: duyệt qua giỏ hàng để tính tiền
    for (let i = 0; i < shop_order_ids.length; i++) {
      const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]
      // B2.1: kiểm tra xem coi sản phẩm gửi về từ client có thật sự đúng với san phẩm dưới db không
      const checkProductServer = await checkProductByServer(item_products)
      // có sản phẩm tìm không ra trong db => nó sẽ return về undefined => !undefined nó sẽ true
      const hasValidProduct = checkProductServer.some((product) => {
        return !product
      })
      if (hasValidProduct) {
        throw new BadRequestError('order wrong!!!')
      }

      // B2.2: tổng tiền của sản phẩm khi trước khi áp dụng giảm giá, vd: sp 15k mua 2 món => 30k
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product!.price * product!.quantity
      }, 0)

      checkout_order.totalPrice += checkoutPrice

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, // tiền trước khi giảm giá
        priceApplyDiscount: checkoutPrice, // tiền sau khi giảm giá
        item_products: checkProductServer
      }

      // B2.3  nếu shop_discount có sử dụng, check xem mã hợp lệ không
      if (shop_discounts.length > 0) {
        // giả sử chỉ có 1 discount
        const { discount = 0 } = await DiscountService.getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer as DiscountProduct[]
        })
        // tổng tiền discount giảm giá, vd: món 1 giảm 3k, món 2 giảm 4k => giảm tổng 7k
        checkout_order.totalDiscount += discount
        if (discount > 0) {
          // tiền sau khi đã trừ giảm giá, vd: 30k - 7k = 23k
          itemCheckout.priceApplyDiscount = checkoutPrice - discount
        }
      }

      // tổng toàn bộ tiền sau cùng (tiền trước khi giảm giá + tiền sau khi giảm giá)
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
      shop_order_ids_new.push(itemCheckout)
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order
    }
  }

  // static async orderyByUser({ shop_order_ids, cartId, userId, user_address = {}, user_payment = {} }) {
  //   const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({
  //     cartId,
  //     userId,
  //     shop_order_ids
  //   })
  //   // check xem coi có vượt quá hàng tồn kho không
  //   const products = shop_order_ids_new.flatMap((order) => order.item_products)
  //   console.log('[1]: ', products)

  //   /*
  //     - khoá lạc quan, nó đã chặn luồng đi của tất cả nhiều luồng, nó cho phép 1 luồng đi vào quản lý giá trị xong trả về lại, xong đến luồng khác ... sử dụng trong trường hợp không để tồn kho giá bán
  //     - Khi thanh toán sản phẩm nào có giá trị tồn kho lớn hơn số lượng người mua ta mới cho phép, trong trường hợp có nhiều người cùng vào mua 1 lúc thì ta sử dụng khoá lạc quan
  //   */

  //   const acquireProduct = []
  //   for (let i = 0; i < products.length; i++) {
  //     const { productId, quantity } = products[i]
  //     const keyLock = await acquireLock(productId, quantity, cartId)
  //     acquireProduct.push(keyLock ? true : false)
  //     if (keyLock) {
  //       await releaseLock(keyLock)
  //     }
  //   }

  //   // check 1 sản phẩm trong kho hết hàng
  //   if (acquireProduct.includes(false)) {
  //     throw new BadRequestError('some products have been updated, please return to cart...')
  //   }

  //   const newOrder = await order.create({
  //     order_userId: userId,
  //     order_checkout: checkout_order,
  //     order_shipping: user_address,
  //     order_payment: user_payment,
  //     order_products: shop_order_ids_new
  //   })

  //   // trường hợp insert thành công thì xoá sản phẩm trong cart
  //   if (newOrder) {
  //     //
  //   }

  //   return newOrder
  // }

  static async getOrdersByUser() {}

  static async getOneOrderByUser() {}

  static async cancelOrderByUser() {}

  static async updateStatusOrderByShop() {}
}
export default CheckoutService
