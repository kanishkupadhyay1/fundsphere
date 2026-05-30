import express from 'express';
import { addEmergencyContact, familyCrud } from '../controllers/profileController.js';
import { canModify, ownerOnly, protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { familyRules } from '../validators/commonValidators.js';

const router = express.Router();

router.use(protect);
router.post('/emergency-contacts', canModify, addEmergencyContact);
router.route('/family').get(ownerOnly, familyCrud.list).post(ownerOnly, familyRules, validate, familyCrud.create);
router.route('/family/:id').get(ownerOnly, familyCrud.get).patch(ownerOnly, familyRules, validate, familyCrud.update).delete(ownerOnly, familyCrud.remove);

export default router;
