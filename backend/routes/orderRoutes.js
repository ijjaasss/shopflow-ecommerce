import express from 'express';
import { getAllOrders, getMyOrders, getOrderById, placeOrder, updateOrderStatus } from '../controllers/orderController.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddlwwares.js';


const router = express.Router();

// Only logged-in users can place orders
router.post('/create', authMiddleware, placeOrder);
router.get('/my-orders', authMiddleware, getMyOrders);
router.get('/getAllOrders', authMiddleware, isAdmin, getAllOrders);
router.put('/:id/status', authMiddleware, isAdmin, updateOrderStatus);
router.get('/:id', authMiddleware, getOrderById);
export default router;
