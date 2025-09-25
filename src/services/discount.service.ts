import { BadRequestError, NotFoundError } from '~/core/error.response'
import discountModel from '~/models/discount.model'
import {
  findAllDiscountCodesSelect,
  checkDiscountExists,
  updateDiscountById,
  deleteDiscountById,
  cancelDiscountCode,
  convertPayload
} from '~/models/repositories/discount.repo'
import { findAllProducts } from '~/models/repositories/product.repo'
import type {
  DiscountAmountParams,
  DiscountCodeCancel,
  DiscountCodeParams,
  DiscountCodeWithProduct,
  DiscountInput
} from '~/types/discountRepo'
import { FindAllParams } from '~/types/productRepo'
import { convertToObjectId, omitNil } from '~/utils'

/*
 1. Generator discount code [shop | admin]
 2. Get all discount code [shop | user]
 3. Get discount amount [user]
 4. Delete discount code [admin | shop]
 5. Cancel discount code [user]
 6. Verify discount code [user]
 */

class DiscountService {
  //  create new discount code by shop id
  static async createDiscountCode(payload: DiscountInput) {
    const {
      name,
      description,
      type,
      value,
      code,
      start_date,
      end_date,
      max_uses,
      uses_count,
      users_used,
      max_uses_per_user,
      min_order_value,
      shopId,
      is_active,
      applies_to,
      product_ids,
      max_value
    } = payload

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError('Start date must be less than end date')
    }

    // check expired
    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError('Discount code has expired')
    }

    const foundDiscount = await checkDiscountExists({
      filter: {
        discount_code: code,
        discount_shopId: convertToObjectId(shopId)
      }
    })

    // check discount code exists
    if (foundDiscount) {
      throw new BadRequestError('Discount code already exists')
    }

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_shopId: shopId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids
    })

    return newDiscount
  }

  static async getAllDiscountCodesByShop({ limit, sort, page, filter, select }: FindAllParams) {
    return await findAllDiscountCodesSelect({ limit, page, sort, filter, select })
  }

  static async updateDiscount(discount_id: string, payload: DiscountInput) {
    const foundDiscount = await checkDiscountExists({
      filter: {
        _id: convertToObjectId(discount_id),
        discount_shopId: convertToObjectId(payload.shopId)
      }
    })

    if (!foundDiscount) {
      throw new BadRequestError('Discount code is not already exists')
    }

    return await updateDiscountById({
      discount_id,
      payload: omitNil(convertPayload(payload))
    })
  }

  // 3. lấy tất cả các sản phẩm có thể áp dụng mã discount này
  static async getAllDiscountCodesWithProduct({ codeId, shopId, limit, page }: DiscountCodeWithProduct) {
    const foundDiscount = await checkDiscountExists({
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectId(shopId)
      }
    })
    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError('Discount not exist')
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount
    let products
    // lấy tất cả mã giảm giá case áp dụng cho tất cả sản phẩm
    if (discount_applies_to === 'all') {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectId(shopId),
          isPublished: true
        },
        limit,
        page,
        sort: 'ctime',
        select: ['product_name']
      })
    }

    // lấy tất cả mã giảm giá theo chỉ định những sản phẩm nào áp dụng
    if (discount_applies_to === 'specific') {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true
        },
        limit,
        page,
        sort: 'ctime',
        select: ['product_name']
      })
    }

    return products
  }

  /*
    Apply discount code
    vi dụ ta có giỏ hàng có 2 món và giờ ta áp dụng discount code cho giỏ hàng này
    products = {
      {
        productId, shopId, quantity, name, price
      },
      {
        productId, shopId, quantity, name, price
      }
    }
  */
  // Tính số tiền giảm giá khi áp dụng discount
  static async getDiscountAmount({ codeId, userId, shopId, products }: DiscountAmountParams) {
    const foundDiscount = await checkDiscountExists({
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectId(shopId)
      }
    })
    if (!foundDiscount) {
      throw new NotFoundError('Discount not exist')
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_users_used,
      discount_start_date,
      discount_end_date,
      discount_max_uses_per_user,
      discount_type,
      discount_value
    } = foundDiscount

    if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date) || !discount_is_active) {
      throw new BadRequestError('Discount code has expired')
    }

    // trường hợp discount = 0 => false, nghĩa là trường hợp này hết discount
    if (!discount_max_uses) {
      throw new BadRequestError('Discount are out')
    }

    // check xem có set giá trị tối thiểu hay không
    let totalOrder = 0
    if (discount_min_order_value > 0) {
      // lấy total
      totalOrder = products.reduce((acc, product) => {
        return acc + product.price * product.quantity
      }, 0)

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(`Discount require a minimum order value of ${discount_min_order_value}`)
      }
    }

    if (discount_max_uses_per_user > 0) {
      const newUserDiscount = discount_users_used.find((user) => user.userId === userId)
      // suy nghĩ thử xem nếu 1 người chỉ dược sư dụng 1 lần
    }

    const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

    return {
      totalOrder, // tổng đơn hảng ban đầu
      discount: amount, // số tiền được giảm
      totalPrice: totalOrder - amount // thành tiền sau khi giảm giá
    }
  }

  // xoá có thể tạo riêng một bảng và chuyển nó qua đó để lưu lại lịch sử
  static async deleteDiscountCode({ shopId, codeId }: DiscountCodeParams) {
    return await deleteDiscountById({ shopId, codeId })
  }

  static async cancelDiscountCode({ codeId, shopId, userId }: DiscountCodeCancel) {
    const foundDiscount = await checkDiscountExists({
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectId(shopId)
      }
    })

    if (!foundDiscount) {
      throw new NotFoundError('Discount not exist')
    }

    return cancelDiscountCode(foundDiscount._id, userId)
  }
}

export default DiscountService
