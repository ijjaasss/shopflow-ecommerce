import express from 'express'
import { getUserProfile, loginUser, registerUser } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddlwwares.js';

const router = express.Router();



router.post('/register', registerUser)
router.post('/login', loginUser);
router.get('/me',authMiddleware,getUserProfile)
export default router