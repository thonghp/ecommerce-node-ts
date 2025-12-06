import { Types } from 'mongoose'
import inventoryModel from '../inventory.model'

type InventoryInput = {
  productId: Types.ObjectId
  shopId?: string | null
  stock: number
  location?: string
}

const insertInventory = async ({ productId, shopId, stock, location = 'unknown' }: InventoryInput) => {
  return await inventoryModel.create({
    inven_productId: productId,
    inven_shopId: shopId,
    inven_stock: stock,
    inven_location: location
  })
}

export { insertInventory }
