import { Router } from 'express'
import accessRouter from './access'
import productRouter from './product'
import discountRouter from './discount'
import cartRouter from './cart'
import checkoutRouter from './checkout'
import commentRouter from './comment'
import notificationRouter from './notification'
import uploadRouter from './upload'
import profileRouter from './profile'
import rbacRouter from './rbac'
import { apiKey, permission } from '~/auth/checkAuth'
// import pushToLogDiscord from '~/middlewares'

const router = Router()

// router.use(pushToLogDiscord)
router.use(apiKey)
router.use(permission('0000'))

router.use('/v1/api/rbac', rbacRouter)
router.use('/v1/api/profile', profileRouter)
router.use('/v1/api/upload', uploadRouter)
router.use('/v1/api/notification', notificationRouter)
router.use('/v1/api/comment', commentRouter)
router.use('/v1/api/checkout', checkoutRouter)
router.use('/v1/api/cart', cartRouter)
router.use('/v1/api/discount', discountRouter)
router.use('/v1/api/product', productRouter)
router.use('/v1/api', accessRouter)

export default router
