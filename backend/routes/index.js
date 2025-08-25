import express from 'express'
import authRoutes from './authRoutes.js'
import productRoutes from './productRoute.js'
import orderRoutes from './orderRoutes.js';
import adminRoutes from './adminRoutes.js';
const router = express.Router();
router.get('/',(req,res)=>{
    res.status(200).json({message:"API is running...."})
})
router.use('/auth', authRoutes);
router.use('/product', productRoutes);

router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);
export default router