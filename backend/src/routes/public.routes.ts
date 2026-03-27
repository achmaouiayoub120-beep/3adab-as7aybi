import { Router } from 'express';
import { publicController } from '../controllers/public.controller';

const router = Router();

router.get('/matches', publicController.getMatches);
router.get('/matches/:id', publicController.getMatchById);
router.get('/teams', publicController.getTeams);
router.get('/teams/:id', publicController.getTeamById);
router.get('/stadiums', publicController.getStadiums);
router.get('/stadiums/:id', publicController.getStadiumById);
router.get('/ranking', publicController.getRanking);

export default router;
