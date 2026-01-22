import type { NextFunction, Request, Response } from 'express'
import { BadRequestError } from '~/core/error.response'

import { SuccessResponse } from '~/core/success.response'
import { uploadImageFromLocal, uploadImageFromUrl } from '~/services/upload.service'

class UploadController {
  uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'upload successfully!',
      metadata: await uploadImageFromUrl()
    }).send(res)
  }

  uploadFileThumb = async (req: Request, res: Response, next: NextFunction) => {
    const { file } = req
    if (!file) {
      throw new BadRequestError('file missing')
    }

    new SuccessResponse({
      message: 'upload successfully!',
      metadata: await uploadImageFromLocal({ path: file.path })
    }).send(res)
  }
}

export default new UploadController()
