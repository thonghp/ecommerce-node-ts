import cloudinary from '~/configs/cloudinary.config'

const uploadImageFromUrl = async () => {
  try {
    const urlImage = 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m2nsqrkm8o3q44_tn.webp'
    const folderName = 'product/8409',
      newFileName = 'testdemo'

    const result = await cloudinary.uploader.upload(urlImage, {
      public_id: newFileName,
      folder: folderName
    })

    return result
  } catch (error) {
    console.error('error uploading image: ', error)
  }
}

const uploadImageFromLocal = async ({ path, folderName = 'product/8409' }: { path: string; folderName?: string }) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      public_id: 'thumb',
      folder: folderName
    })
    // console.log(result)

    return {
      image_url: result.secure_url,
      shopId: 8409,
      thumb_url: cloudinary.url(result.public_id, {
        width: 100,
        height: 100,
        format: 'jpg'
      })
    }
  } catch (error) {
    console.error('error uploading image:;', error)
  }
}

export { uploadImageFromUrl, uploadImageFromLocal }
