export type NotificationParams = {
  type: string
  receivedId: number
  senderId?: string | null
  options: {
    product_name: string
    shop_name?: string | null
  }
}
