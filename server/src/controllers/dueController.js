import Document from '../models/Document.js';
import FinancialRecord from '../models/FinancialRecord.js';
import Loan from '../models/Loan.js';
import { daysUntil } from '../utils/apiFeatures.js';

const bucket = (days) => {
  if (days < 0) return 'overdue';
  if (days <= 7) return 'dueIn7Days';
  if (days <= 30) return 'dueIn30Days';
  if (days <= 90) return 'dueIn90Days';
  return 'later';
};

export const getDueCenter = async (req, res, next) => {
  try {
    const owner = req.user.owner || req.user._id;
    const [records, loans, documents] = await Promise.all([
      FinancialRecord.find({ owner }),
      Loan.find({ owner }),
      Document.find({ owner, expiryDate: { $exists: true } })
    ]);

    const result = { dueIn7Days: [], dueIn30Days: [], dueIn90Days: [], overdue: [], matured: [] };
    const addItem = (item) => {
      const daysRemaining = daysUntil(item.dueDate);
      const category = bucket(daysRemaining);
      if (category === 'later') return;
      result[category].push({ ...item, daysRemaining });
      if (item.kind === 'Maturity' && daysRemaining < 0) result.matured.push({ ...item, daysRemaining });
    };

    records.forEach((record) => {
      if (record.maturityDate) addItem({ kind: 'Maturity', name: record.recordName, amount: record.amount, dueDate: record.maturityDate, source: 'record', id: record._id });
      if (record.dynamicFields?.nextDueDate) addItem({ kind: 'Premium Due', name: record.recordName, amount: record.dynamicFields.premiumAmount, dueDate: record.dynamicFields.nextDueDate, source: 'record', id: record._id });
    });
    loans.filter((loan) => loan.status !== 'Fully Paid' && loan.dueDate).forEach((loan) => addItem({ kind: 'Loan Due', name: loan.personName, amount: loan.principalAmount, dueDate: loan.dueDate, source: 'loan', id: loan._id }));
    documents.forEach((document) => addItem({ kind: 'Document Expiry', name: document.name, dueDate: document.expiryDate, source: 'document', id: document._id }));

    res.json(result);
  } catch (error) {
    next(error);
  }
};
