import express from 'express';
import adminRoutes from './adminRoutes.js';
import authRoutes from './authRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import documentRoutes from './documentRoutes.js';
import dueRoutes from './dueRoutes.js';
import expenseRoutes from './expenseRoutes.js';
import familyRoutes from './familyRoutes.js';
import institutionRoutes from './institutionRoutes.js';
import loanRoutes from './loanRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import profileRoutes from './profileRoutes.js';
import recordRoutes from './recordRoutes.js';
import reportRoutes from './reportRoutes.js';
import searchRoutes from './searchRoutes.js';
import { registeredRoutes } from './routeDiagnostics.js';

const router = express.Router();

router.get('/routes', (_req, res) => {
  res.json({
    service: 'fundsphere-api',
    routes: registeredRoutes
  });
});

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/records', recordRoutes);
router.use('/assets', recordRoutes);
router.use('/institutions', institutionRoutes);
router.use('/loans', loanRoutes);
router.use('/liabilities', loanRoutes);
router.use('/ledger', loanRoutes);
router.use('/expenses', expenseRoutes);
router.use('/documents', documentRoutes);
router.use('/reports', reportRoutes);
router.use('/notifications', notificationRoutes);
router.use('/profile', profileRoutes);
router.use('/family', familyRoutes);
router.use('/due-center', dueRoutes);
router.use('/search', searchRoutes);
router.use('/admin', adminRoutes);

export default router;


