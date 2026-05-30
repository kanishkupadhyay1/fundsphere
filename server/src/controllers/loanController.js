import Loan from '../models/Loan.js';
import { createCrudController } from './factoryController.js';

export const loanCrud = createCrudController(Loan, ['personName', 'mobile']);

export const addRepayment = async (req, res, next) => {
  try {
    const owner = req.user.owner || req.user._id;
    const loan = await Loan.findOne({ _id: req.params.id, owner });
    if (!loan) {
      const error = new Error('Loan not found');
      error.statusCode = 404;
      throw error;
    }
    loan.repayments.push(req.body);
    if (loan.outstandingPrincipal <= 0) loan.status = 'Fully Paid';
    else loan.status = 'Partially Paid';
    await loan.save();
    res.status(201).json(loan);
  } catch (error) {
    next(error);
  }
};

export const getLoanSummary = async (req, res, next) => {
  try {
    const owner = req.user.owner || req.user._id;
    const loans = await Loan.find({ owner });
    res.json({
      totalGiven: loans.filter((loan) => loan.direction === 'Money Given').reduce((sum, loan) => sum + loan.principalAmount, 0),
      totalTaken: loans.filter((loan) => loan.direction === 'Money Taken').reduce((sum, loan) => sum + loan.principalAmount, 0),
      outstandingAmount: loans.reduce((sum, loan) => sum + loan.outstandingPrincipal, 0),
      overdueLoans: loans.filter((loan) => loan.status === 'Overdue').length
    });
  } catch (error) {
    next(error);
  }
};
