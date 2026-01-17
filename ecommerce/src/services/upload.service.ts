import cloudinary from '~/configs/cloudinary.config'

const uploadImageFromUrl = async () => {
  try {
    const urlImage = 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m2nsqrkm8o3q44_tn.webp'
    const folderName = 'product/shopId',
      newFileName = 'testdemo'

    const result = await cloudinary.uploader.upload(urlImage, {
      public_id: newFileName,
      folder: folderName
    })

    return result
  } catch (error) {
    console.error('error uploading image:;', error)
  }
}

export { uploadImageFromUrl }
