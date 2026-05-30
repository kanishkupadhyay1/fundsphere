import Expense from '../models/Expense.js';
import FinancialRecord from '../models/FinancialRecord.js';
import Institution from '../models/Institution.js';
import Loan from '../models/Loan.js';
import Report from '../models/Report.js';
import { createCrudController } from './factoryController.js';

export const reportCrud = createCrudController(Report, ['title', 'type']);

export const generateReport = async (req, res, next) => {
  try {
    const owner = req.user.owner || req.user._id;
    const { type, title = type } = req.body;
    const [records, loans, expenses, institutions] = await Promise.all([
      FinancialRecord.find({ owner }),
      Loan.find({ owner }),
      Expense.find({ owner }),
      Institution.find({ owner })
    ]);

    const payload = {
      'Asset Summary': records,
      'Due Report': records.filter((record) => record.maturityDate || record.dynamicFields?.nextDueDate),
      'Maturity Report': records.filter((record) => record.maturityDate),
      'Loan Report': loans,
      'Expense Report': expenses,
      'Nominee Report': records.map((record) => ({ recordName: record.recordName, institution: record.institution, nominee: record.nominee || null })),
      'Institution Report': institutions
    }[type] || [];

    const report = await Report.create({ owner, title, type, filters: req.body.filters, generatedBy: req.user._id });
    res.status(201).json({ report, data: payload });
  } catch (error) {
    next(error);
  }
};
