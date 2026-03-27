import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate, requireAdmin);

// Dashboard
router.get('/stats', adminController.getStats);
router.get('/analytics', adminController.getAnalytics);

// Users
router.get('/users', adminController.getUsers);
router.patch('/users/:id/status', adminController.toggleUser);

// Reservations & Tickets
router.get('/reservations', adminController.getAllReservations);
router.get('/tickets', adminController.getTickets);

// Ticket validation
router.post('/tickets/validate/:code', adminController.validateTicket);

// Teams CRUD
router.post('/teams', adminController.createTeam);
router.put('/teams/:id', adminController.updateTeam);
router.delete('/teams/:id', adminController.deleteTeam);

// Stadiums CRUD
router.post('/stadiums', adminController.createStadium);
router.put('/stadiums/:id', adminController.updateStadium);
router.delete('/stadiums/:id', adminController.deleteStadium);

// Matches CRUD
router.post('/matches', adminController.createMatch);
router.put('/matches/:id', adminController.updateMatch);
router.delete('/matches/:id', adminController.deleteMatch);

export default router;
