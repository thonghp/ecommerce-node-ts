import type { NextFunction, Request, Response } from 'express'

import { SuccessResponse } from '~/core/success.response'

const dataProfiles = [
  {
    usr_id: 1,
    usr_name: 'cr7',
    usr_avatar: 'image.com/user/1'
  },
  {
    usr_id: 2,
    usr_name: 'm10',
    usr_avatar: 'image.com/user/2'
  },
  {
    usr_id: 3,
    usr_name: 'neymar',
    usr_avatar: 'image.com/user/3'
  }
]

class ProfileController {
  // Admin
  profiles = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'View all profiles',
      metadata: dataProfiles
    }).send(res)
  }

  // UserShop
  profile = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'View one profile',
      metadata: {
        usr_id: 2,
        usr_name: 'm10',
        usr_avatar: 'image.com/user/2'
      }
    }).send(res)
  }
}

export default new ProfileController()
