import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAdminStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();

  const orders = await Order.find();
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  const lowStockCount = await Product.countDocuments({ stock: { $lt: 5 } });

  res.status(200).json({
    success: true,
    stats: {
      totalOrders,
      totalRevenue,
      lowStockCount,
    },
  });
});
