import express from 'express';
import { getAdminStats } from '../controllers/adminController.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddlwwares.js';

const router = express.Router();

router.get('/stats', authMiddleware, isAdmin, getAdminStats);

export default router;
