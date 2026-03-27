import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { sendSuccess } from '../utils/response.utils';

export const publicController = {
  async getMatches(_req: Request, res: Response, next: NextFunction) {
    try {
      const matches = await prisma.match.findMany({
        include: { homeTeam: true, awayTeam: true, stadium: true },
        orderBy: { date: 'asc' },
      });
      sendSuccess(res, matches);
    } catch (e) { next(e); }
  },

  async getMatchById(req: Request, res: Response, next: NextFunction) {
    try {
      const match = await prisma.match.findUnique({
        where: { id: Number(req.params.id) },
        include: { homeTeam: true, awayTeam: true, stadium: true },
      });
      if (!match) return res.status(404).json({ success: false, message: 'Match introuvable.' });
      sendSuccess(res, match);
    } catch (e) { next(e); }
  },

  async getTeams(_req: Request, res: Response, next: NextFunction) {
    try {
      const teams = await prisma.team.findMany({
        include: { stadium: true },
        orderBy: { name: 'asc' },
      });
      sendSuccess(res, teams);
    } catch (e) { next(e); }
  },

  async getTeamById(req: Request, res: Response, next: NextFunction) {
    try {
      const team = await prisma.team.findUnique({
        where: { id: Number(req.params.id) },
        include: { stadium: true },
      });
      if (!team) return res.status(404).json({ success: false, message: 'Équipe introuvable.' });
      sendSuccess(res, team);
    } catch (e) { next(e); }
  },

  async getStadiums(_req: Request, res: Response, next: NextFunction) {
    try {
      const stadiums = await prisma.stadium.findMany({ orderBy: { name: 'asc' } });
      sendSuccess(res, stadiums);
    } catch (e) { next(e); }
  },

  async getStadiumById(req: Request, res: Response, next: NextFunction) {
    try {
      const stadium = await prisma.stadium.findUnique({
        where: { id: Number(req.params.id) },
        include: { teams: true, matches: { include: { homeTeam: true, awayTeam: true }, take: 5, orderBy: { date: 'desc' } } },
      });
      if (!stadium) return res.status(404).json({ success: false, message: 'Stade introuvable.' });
      sendSuccess(res, stadium);
    } catch (e) { next(e); }
  },

  async getRanking(_req: Request, res: Response, next: NextFunction) {
    try {
      const teams = await prisma.team.findMany({
        include: { stadium: true },
        orderBy: { name: 'asc' },
      });
      // Return teams — ranking computed statically for now (same as original)
      sendSuccess(res, teams);
    } catch (e) { next(e); }
  },
};
