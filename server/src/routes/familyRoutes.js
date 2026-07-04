import express from 'express';
import { familyCrud } from '../controllers/profileController.js';
import { ownerOnly, protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { familyRules } from '../validators/commonValidators.js';

const router = express.Router();

router.use(protect, ownerOnly);
router.route('/').get(familyCrud.list).post(familyRules, validate, familyCrud.create);
router.route('/:id').get(familyCrud.get).patch(familyRules, validate, familyCrud.update).delete(familyCrud.remove);

export default router;
