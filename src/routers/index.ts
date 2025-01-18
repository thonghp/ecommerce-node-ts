import { Router } from 'express'
import accessRouter from './access'
import productRouter from './product'
import { apiKey, permission } from '~/auth/checkAuth'

const router = Router()

router.use(apiKey)
router.use(permission('0000'))

router.use('/v1/api', accessRouter)
router.use('/v1/api/product', productRouter)

export default router
