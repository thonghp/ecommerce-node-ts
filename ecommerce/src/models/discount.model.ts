import mongoose, { model, Schema, Types, type InferSchemaType } from 'mongoose'

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'discounts'

const discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      required: true
    },
    discount_description: {
      type: String,
      required: true
    },
    discount_type: {
      type: String,
      default: 'fixed_amount' // fixed_amount (theo số tiền), percentage (theo %)
    },
    discount_value: {
      type: Number, // này để lưu giá trị của discount type
      required: true
    },
    discount_code: {
      type: String,
      required: true
    },
    discount_start_date: {
      type: Date,
      required: true
    },
    discount_end_date: {
      type: Date,
      required: true
    },
    // số lượng discount code cung cấp (vd: mã này ta có thể áp dụng cho 100 khách hàng)
    discount_max_uses: {
      type: Number,
      required: true
    },
    // số lượng người đã sử dụng mã này
    discount_uses_count: {
      type: Number,
      required: true
    },
    // danh sách những người đã sử dụng discount này
    discount_users_used: {
      type: Array,
      default: []
    },
    // số lượng cho phép tối đa một user được sử dụng
    discount_max_uses_per_user: {
      type: Number,
      required: true
    },
    // giá trị đơn hàng tối thiểu để áp dụng discount này
    discount_min_order_value: {
      type: Number,
      required: true
    },
    discount_shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    },
    discount_is_active: {
      type: Boolean,
      default: true
    },
    // Áp dụng cho sản phẩm nào (chỉ định một số sản phẩm hoặc tất cả sản phẩm đều áp dụng đc)
    discount_applies_to: {
      type: String,
      required: true,
      enum: ['all', 'specific']
    },
    // sử dụng cho trường hợp áp dụng discount cho sản phẩm chỉ định
    discount_product_ids: {
      type: Array,
      default: [] // số sản phẩm được áp dụng discount này
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

export type DiscountType = InferSchemaType<typeof discountSchema> & {
  _id: Types.ObjectId
}

const discountModel = mongoose.models[DOCUMENT_NAME] || model(DOCUMENT_NAME, discountSchema)

export default discountModel
