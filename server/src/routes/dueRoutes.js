import express from 'express';
import { getDueCenter } from '../controllers/dueController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getDueCenter);

export default router;
