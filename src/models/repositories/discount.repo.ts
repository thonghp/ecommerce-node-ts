import { Types, type SortOrder } from 'mongoose'
import { getSelectData, unGetSelectData } from '~/utils'
import discountModel, { type DiscountType } from '../discount.model'
import { FindAllParams } from '~/types/productRepo'
import type { DiscountCodeParams, DiscountInput } from '~/types/discountRepo'

type UpdateDiscountByIdParams = {
  discount_id: string
  payload?: Record<string, unknown>
  isNew?: boolean
}

type FindAllDiscountCodesParams = Omit<FindAllParams, 'select'> & {
  select: Record<string, number>
}

const findAllDiscountCodesUnselect = async ({ limit, sort, page, filter, select }: FindAllParams) => {
  return findAllDiscountCodes({ filter, sort, page, limit, select: unGetSelectData(select) })
}

const findAllDiscountCodesSelect = async ({ limit, sort, page, filter, select }: FindAllParams) => {
  return findAllDiscountCodes({ filter, sort, page, limit, select: getSelectData(select) })
}

const findAllDiscountCodes = async ({ filter, sort, page, limit, select }: FindAllDiscountCodesParams) => {
  const skip = (page - 1) * limit
  const sortBy: { [key: string]: SortOrder } = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

  return await discountModel.find(filter).sort(sortBy).skip(skip).limit(limit).select(select).lean().exec()
}

const checkDiscountExists = async ({ filter }: { filter: Partial<DiscountType> }) => {
  return await discountModel.findOne(filter).lean<DiscountType>().exec()
}

const updateDiscountById = async ({ discount_id, payload, isNew = true }: UpdateDiscountByIdParams) => {
  return await discountModel.findByIdAndUpdate(discount_id, payload, { new: isNew })
}

const deleteDiscountById = async ({ shopId, codeId }: DiscountCodeParams) => {
  return await discountModel.findOneAndDelete({ discount_shopId: shopId, discount_code: codeId })
}

const cancelDiscountCode = async (id: Types.ObjectId, userId: string) => {
  return await discountModel.findByIdAndUpdate(id, {
    $pull: {
      discount_users_used: userId
    },
    $inc: {
      discount_max_uses: 1,
      discount_uses_count: -1
    }
  })
}

const convertPayload = (payload: DiscountInput) => {
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
  const result = {
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
  }

  return result
}

export {
  findAllDiscountCodesSelect,
  findAllDiscountCodesUnselect,
  checkDiscountExists,
  updateDiscountById,
  deleteDiscountById,
  cancelDiscountCode,
  convertPayload
}
