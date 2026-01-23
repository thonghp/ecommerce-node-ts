import type { NextFunction, Request, Response } from 'express'
import { BadRequestError } from '~/core/error.response'

import { SuccessResponse } from '~/core/success.response'
import { uploadImageFromLocal, uploadImageFromUrl, uploadImageFromLocalFiles } from '~/services/upload.service'

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

  uploadFilesFromLocal = async (req: Request, res: Response, next: NextFunction) => {
    const { files } = req
    if (!files || files.length === 0) {
      throw new BadRequestError('file missing')
    }

    const filesArray = files as Express.Multer.File[]

    new SuccessResponse({
      message: 'upload successfully!',
      metadata: await uploadImageFromLocalFiles({ files: filesArray })
    }).send(res)
  }
}

export default new UploadController()
