import express from 'express'
import userRouter from './user'
import adminRouter from './admin'
require('../db/db')
const router = express.Router();

router.use('/user',userRouter)

router.use('/admin',adminRouter)

export default router;
