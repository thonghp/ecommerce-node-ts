import Notify from '~/models/notification.model'
import { NotificationParams } from '~/types/notificationRepo'
import { NOTIFY_TYPE } from '~/utils/constants'

type MatchCondition = {
  noti_receivedId: number
  noti_type?: string
}

const pushNotifyToSystem = async ({
  type = 'SHOP-001',
  receivedId = 1,
  senderId = '1',
  options
}: NotificationParams) => {
  let notify_content
  if (type === NOTIFY_TYPE.NEW_PRODUCT) {
    notify_content = '@@@ vừa mới thêm 1 sản phẩm: @@@@'
  } else if (type === NOTIFY_TYPE.NEW_PROMOTION) {
    notify_content = '@@@ vừa mới thêm 1 voucher: @@@@@'
  }

  const newNotify = await Notify.create({
    noti_type: type,
    noti_content: notify_content,
    noti_senderId: senderId,
    noti_receivedId: receivedId,
    noti_options: options
  })

  return newNotify
}

const listNotifyByUser = async ({ userId = 1, type = 'ALL', isRead = 0 }) => {
  const match: MatchCondition = { noti_receivedId: userId }
  if (type !== NOTIFY_TYPE.ALL) {
    match['noti_type'] = type
  }

  return await Notify.aggregate([
    {
      $match: match
    },
    {
      $project: {
        noti_type: 1,
        noti_senderId: 1,
        noti_receivedId: 1,
        noti_content: {
          $concat: [
            {
              $substr: ['$noti_options.shop_name', 0, -1]
            },
            ' vừa mới thêm 1 sản phẩm: ',
            {
              $substr: ['$noti_options.product_name', 0, -1]
            }
          ]
        },
        createdAt: 1,
        noti_options: 1
      }
    }
  ])
}

export { pushNotifyToSystem, listNotifyByUser }
