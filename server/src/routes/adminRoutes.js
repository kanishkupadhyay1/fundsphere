import express from 'express';
import { ownerOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', ownerOnly, (_req, res) => {
  res.json({
    message: 'Admin API is available',
    modules: ['users', 'audit-logs', 'notifications', 'reports', 'documents', 'analytics']
  });
});

export default router;
