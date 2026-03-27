import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service';
import { sendSuccess } from '../utils/response.utils';

export const adminController = {
  // Dashboard
  async getStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await adminService.getStats();
      sendSuccess(res, stats);
    } catch (e) { next(e); }
  },

  // Users
  async getUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await adminService.getUsers();
      sendSuccess(res, users);
    } catch (e) { next(e); }
  },
  async toggleUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await adminService.setUserStatus(req.params.id as string, req.body.status);
      sendSuccess(res, user);
    } catch (e) { next(e); }
  },

  // Reservations
  async getAllReservations(_req: Request, res: Response, next: NextFunction) {
    try {
      const reservations = await adminService.getAllReservations();
      sendSuccess(res, reservations);
    } catch (e) { next(e); }
  },

  // Ticket validation
  async validateTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await adminService.validateTicket(req.params.code);
      sendSuccess(res, result);
    } catch (e) { next(e); }
  },

  // Teams CRUD
  async createTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const team = await adminService.createTeam(req.body);
      sendSuccess(res, team, 201);
    } catch (e) { next(e); }
  },
  async updateTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const team = await adminService.updateTeam(Number(req.params.id), req.body);
      sendSuccess(res, team);
    } catch (e) { next(e); }
  },
  async deleteTeam(req: Request, res: Response, next: NextFunction) {
    try {
      await adminService.deleteTeam(Number(req.params.id));
      sendSuccess(res, { deleted: true });
    } catch (e) { next(e); }
  },

  // Stadiums CRUD
  async createStadium(req: Request, res: Response, next: NextFunction) {
    try {
      const stadium = await adminService.createStadium(req.body);
      sendSuccess(res, stadium, 201);
    } catch (e) { next(e); }
  },
  async updateStadium(req: Request, res: Response, next: NextFunction) {
    try {
      const stadium = await adminService.updateStadium(Number(req.params.id), req.body);
      sendSuccess(res, stadium);
    } catch (e) { next(e); }
  },
  async deleteStadium(req: Request, res: Response, next: NextFunction) {
    try {
      await adminService.deleteStadium(Number(req.params.id));
      sendSuccess(res, { deleted: true });
    } catch (e) { next(e); }
  },

  // Matches CRUD
  async createMatch(req: Request, res: Response, next: NextFunction) {
    try {
      const match = await adminService.createMatch(req.body);
      sendSuccess(res, match, 201);
    } catch (e) { next(e); }
  },
  async updateMatch(req: Request, res: Response, next: NextFunction) {
    try {
      const match = await adminService.updateMatch(Number(req.params.id), req.body);
      sendSuccess(res, match);
    } catch (e) { next(e); }
  },
  async deleteMatch(req: Request, res: Response, next: NextFunction) {
    try {
      await adminService.deleteMatch(Number(req.params.id));
      sendSuccess(res, { deleted: true });
    } catch (e) { next(e); }
  },

  async getTickets(_req: Request, res: Response, next: NextFunction) {
    try {
      const tickets = await adminService.getAllTickets();
      sendSuccess(res, tickets);
    } catch (e) { next(e); }
  },
  // Analytics
  async getAnalytics(_req: Request, res: Response, next: NextFunction) {
    try {
      const analytics = await adminService.getAnalytics();
      sendSuccess(res, analytics);
    } catch (e) { next(e); }
  },
};
