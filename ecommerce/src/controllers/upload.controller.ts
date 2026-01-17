import type { NextFunction, Request, Response } from 'express'

import { CREATED, SuccessResponse } from '~/core/success.response'
import { uploadImageFromUrl } from '~/services/upload.service'

class UploadController {
  uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'upload successfully!',
      metadata: await uploadImageFromUrl()
    }).send(res)
  }
}

export default new UploadController()
