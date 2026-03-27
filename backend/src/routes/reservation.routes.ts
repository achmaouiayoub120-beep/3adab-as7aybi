import { Router } from 'express';
import { reservationController } from '../controllers/reservation.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createReservationSchema } from '../validators/reservation.validator';

const router = Router();

router.use(authenticate);
router.post('/', validate(createReservationSchema), reservationController.create);
router.get('/mine', reservationController.myReservations);
router.get('/:id', reservationController.getById);
router.patch('/:id/cancel', reservationController.cancel);

export default router;
