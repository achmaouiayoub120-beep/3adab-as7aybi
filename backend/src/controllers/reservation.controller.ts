import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { reservationService } from '../services/reservation.service';
import { sendSuccess, sendError } from '../utils/response.utils';

export const reservationController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await reservationService.create({
        userId: req.user!.userId,
        ...req.body,
      });
      sendSuccess(res, result, 201);
    } catch (e) { next(e); }
  },

  async myReservations(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const reservations = await reservationService.getUserReservations(req.user!.userId);
      sendSuccess(res, reservations);
    } catch (e) { next(e); }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const reservation = await reservationService.getById(req.params.id, req.user!.userId);
      if (!reservation) return sendError(res, 'Réservation introuvable.', 404);
      sendSuccess(res, reservation);
    } catch (e) { next(e); }
  },

  async cancel(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await reservationService.cancel(req.params.id, req.user!.userId);
      sendSuccess(res, result);
    } catch (e) { next(e); }
  },
};
