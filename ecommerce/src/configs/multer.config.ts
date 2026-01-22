import multer from 'multer'

const uploadMemory = multer({ storage: multer.memoryStorage() })

// nên dùng trên disk hơn là dùng trên memory tránh cạn kiệt bộ nhớ
const uploadDisk = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './src/uploads/')
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`)
    }
  })
})

export { uploadMemory, uploadDisk }
