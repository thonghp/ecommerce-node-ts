import type { NextFunction, Request, Response } from 'express'

import { SuccessResponse } from '~/core/success.response'
import { listNotifyByUser } from '~/services/notification.service'

class NotificationController {
  listNotifyByUser = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'get list notify success',
      metadata: await listNotifyByUser(req.query)
    }).send(res)
  }
}

export default new NotificationController()
