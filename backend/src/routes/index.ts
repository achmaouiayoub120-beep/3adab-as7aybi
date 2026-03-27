import { Router } from 'express';
import authRoutes from './auth.routes';
import publicRoutes from './public.routes';
import reservationRoutes from './reservation.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/', publicRoutes);
router.use('/reservations', reservationRoutes);
router.use('/admin', adminRoutes);

export default router;
