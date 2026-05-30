import express from 'express';
import { addRepayment, getLoanSummary, loanCrud } from '../controllers/loanController.js';
import { canModify, protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { loanRules, repaymentRules } from '../validators/commonValidators.js';

const router = express.Router();

router.use(protect);
router.get('/summary', getLoanSummary);
router.route('/').get(loanCrud.list).post(canModify, loanRules, validate, loanCrud.create);
router.route('/:id').get(loanCrud.get).patch(canModify, loanRules, validate, loanCrud.update).delete(canModify, loanCrud.remove);
router.post('/:id/repayments', canModify, repaymentRules, validate, addRepayment);

export default router;
