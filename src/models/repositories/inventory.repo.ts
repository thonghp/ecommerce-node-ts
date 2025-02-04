import { InventoryInput } from '~/types/inventoryRepo'
import inventoryModel from '../inventory.model'

const insertInventory = async ({ productId, shopId, stock, location = 'unknown' }: InventoryInput) => {
  return await inventoryModel.create({
    inven_productId: productId,
    inven_shopId: shopId,
    inven_stock: stock,
    inven_location: location
  })
}

export { insertInventory }
