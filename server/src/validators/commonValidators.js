import { body } from 'express-validator';

export const financialRecordRules = [
  body('type').notEmpty().withMessage('Record type is required'),
  body('institution').notEmpty().withMessage('Institution is required'),
  body('recordName').notEmpty().withMessage('Record name is required'),
  body('amount').optional().isNumeric().withMessage('Amount must be numeric')
];

export const institutionRules = [
  body('name').notEmpty().withMessage('Institution name is required'),
  body('type').notEmpty().withMessage('Institution type is required')
];

export const loanRules = [
  body('direction').isIn(['Money Given', 'Money Taken']).withMessage('Loan type is required'),
  body('personName').notEmpty().withMessage('Person name is required'),
  body('principalAmount').isNumeric().withMessage('Principal amount is required'),
  body('loanDate').isISO8601().withMessage('Loan date is required')
];

export const repaymentRules = [
  body('amount').isNumeric().withMessage('Repayment amount is required')
];

export const expenseRules = [
  body('date').isISO8601().withMessage('Expense date is required'),
  body('amount').isNumeric().withMessage('Amount is required'),
  body('category').notEmpty().withMessage('Category is required')
];

export const familyRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required')
];
