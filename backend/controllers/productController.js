import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import { isValid } from '../utils/validation.js';
import cloudinary from '../config/cloudinary.js';
export const addProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, stock } = req.body;

  if (!isValid(name, price, stock)) {
    return next(new AppError("Name, price, and stock are required", 400));
  }

  const image = req.file ? req.file.path : "https://via.placeholder.com/150";

  const product = await Product.create({
    name,
    description,
    price,
    stock,
    image,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;      
  const limit = parseInt(req.query.limit) || 10;   
  const skip = (page - 1) * limit;

  const total = await Product.countDocuments();   
  const products = await Product.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 }); 

  res.status(200).json({
    success: true,
    total,
    page,
    pages: Math.ceil(total / limit),
    products,
  });
});

export const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, stock } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }



  // Update other fields
  product.name = name ?? product.name;
  product.description = description ?? product.description;
  product.price = price ?? product.price;
  product.stock = stock ?? product.stock;

  const updatedProduct = await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product: updatedProduct,
  });
});

export const updateProductImage = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  if (!req.file) {
    return next(new AppError("No image file uploaded", 400));
  }



  product.image = req.file.path;

 await product.save();

  res.status(200).json({
    success: true,
    message: "Product image updated successfully",
    product,
  });
});


export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  if (
    product.image &&
    !product.image.includes("via.placeholder.com")
  ) {
    const publicId = product.image.split('/').pop().split('.')[0]; 
    await cloudinary.uploader.destroy(`products/${publicId}`); 
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
