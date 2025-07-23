import { Router } from 'express';
import userRoutes from './userRoutes.js';

const router = Router();

// API Routes
router.use('/users', userRoutes);

// Add more route files here as needed
// router.use('/posts', postRoutes);
// router.use('/auth', authRoutes);

export default router;
