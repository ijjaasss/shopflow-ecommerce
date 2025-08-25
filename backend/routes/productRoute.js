import express from 'express'
import upload from '../middlewares/upload.js';
import { addProduct, deleteProduct, getAllProducts, getProductById, updateProduct, updateProductImage } from '../controllers/productController.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddlwwares.js';


const router = express.Router();

router.post('/addproduct',authMiddleware,upload.single('image'),isAdmin, addProduct )
router.get('/getproducts',getAllProducts)
router.get('/:id', getProductById);
router.put('/update/:id',authMiddleware,isAdmin,updateProduct)
router.put('/update-image/:id',authMiddleware, upload.single('image'),isAdmin, updateProductImage);
router.delete('/delete/:id', authMiddleware,isAdmin,deleteProduct);
export default router