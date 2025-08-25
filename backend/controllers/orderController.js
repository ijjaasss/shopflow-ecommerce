import Order from '../models/Order.js';
import Product from '../models/Product.js';
import AppError from '../utils/appError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const placeOrder = asyncHandler(async (req, res, next) => {
  const { orderItems, shippingAddress } = req.body;


  if (!orderItems || orderItems.length === 0) {
    return next(new AppError("No order items provided", 400));
  }

  let totalPrice = 0;

  for (const item of orderItems) {
    const product = await Product.findById(item.product);

    if (!product) {
      return next(new AppError(`Product not found: ${item.product}`, 404));
    }

    if (product.stock < item.qty) {
      return next(new AppError(`Not enough stock for ${product.name}`, 400));
    }

    totalPrice += item.qty * product.price;
  }


  const order = await Order.create({
    user: req.user._id, 
    orderItems,
    shippingAddress,
    totalPrice,
  });

  // Reduce stock
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    product.stock -= item.qty;
    await product.save();
  }

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order,
  });
});

export const getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

export const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')     
    .populate('orderItems.product');  
  if (!order) {
    return next(new AppError("Order not found", 404));
  }

 

  res.status(200).json({
    success: true,
    order,
  });
});

export const getAllOrders = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await Order.countDocuments();

  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    total,
    page,
    pages: Math.ceil(total / limit),
    count: orders.length,
    orders,
  });
});

const allowedTransitions = {
  Pending: 'Processing',
  Processing: 'Shipped',
  Shipped: 'Delivered',
};

export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  const currentStatus = order.status;
  const nextStatus = allowedTransitions[currentStatus];

  if (!nextStatus) {
    return next(
      new AppError(`Cannot update status from '${currentStatus}'`, 400)
    );
  }

  order.status = nextStatus;
  const updatedOrder = await order.save();

  res.status(200).json({
    success: true,
    message: `Order status updated to ${nextStatus}`,
    order: updatedOrder,
  });
});