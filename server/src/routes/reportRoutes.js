import express from 'express';
import { generateReport, reportCrud } from '../controllers/reportController.js';
import { canModify, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', reportCrud.list);
router.post('/generate', canModify, generateReport);
router.get('/:id', reportCrud.get);

export default router;
