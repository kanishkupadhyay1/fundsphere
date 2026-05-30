import Document from '../models/Document.js';
import Expense from '../models/Expense.js';
import FinancialRecord from '../models/FinancialRecord.js';
import Loan from '../models/Loan.js';
import { daysUntil } from '../utils/apiFeatures.js';

export const getDashboard = async (req, res, next) => {
  try {
    const owner = req.user.owner || req.user._id;
    const [records, loans, totalDocuments] = await Promise.all([
      FinancialRecord.find({ owner }),
      Loan.find({ owner }),
      Document.countDocuments({ owner })
    ]);

    const sumByType = (type) => records.filter((record) => record.type === type).reduce((sum, record) => sum + (record.amount || record.dynamicFields?.currentValue || 0), 0);
    const totalValue = records.reduce((sum, record) => sum + (record.amount || record.dynamicFields?.currentValue || 0), 0);
    const actionRequired = records
      .flatMap((record) => [
        record.maturityDate ? { category: 'Maturity', name: record.recordName, amount: record.amount, dueDate: record.maturityDate, daysRemaining: daysUntil(record.maturityDate), recordId: record._id } : null,
        record.dynamicFields?.nextDueDate ? { category: 'Premium Due', name: record.recordName, amount: record.dynamicFields.premiumAmount, dueDate: record.dynamicFields.nextDueDate, daysRemaining: daysUntil(record.dynamicFields.nextDueDate), recordId: record._id } : null,
        !record.nominee ? { category: 'Missing Nominee', name: record.recordName, institution: record.institution, recordId: record._id } : null,
        !record.referenceNumber || !record.institution ? { category: 'Missing Information', name: record.recordName, recordId: record._id } : null
      ])
      .filter(Boolean)
      .filter((item) => item.daysRemaining === undefined || item.daysRemaining <= 90)
      .sort((a, b) => (a.daysRemaining ?? 999) - (b.daysRemaining ?? 999))
      .slice(0, 10);

    const overdueLoans = loans.filter((loan) => loan.dueDate && daysUntil(loan.dueDate) < 0 && loan.status !== 'Fully Paid');

    res.json({
      totals: {
        totalFinancialRecordsValue: totalValue,
        totalBankBalance: sumByType('Bank Account'),
        totalFDValue: sumByType('Fixed Deposit'),
        totalInsuranceValue: sumByType('Insurance Policy'),
        totalPPFNPSValue: sumByType('PPF') + sumByType('NPS'),
        totalMutualFundValue: sumByType('Mutual Fund'),
        totalGoldValue: sumByType('Gold'),
        totalPropertyValue: sumByType('Property')
      },
      quickStats: {
        activeRecords: records.filter((record) => record.status === 'Active').length,
        upcomingDueItems: actionRequired.filter((item) => item.daysRemaining >= 0).length,
        overdueItems: actionRequired.filter((item) => item.daysRemaining < 0).length + overdueLoans.length,
        totalDocuments,
        totalLoansGiven: loans.filter((loan) => loan.direction === 'Money Given').reduce((sum, loan) => sum + loan.principalAmount, 0),
        totalLoansTaken: loans.filter((loan) => loan.direction === 'Money Taken').reduce((sum, loan) => sum + loan.principalAmount, 0)
      },
      actionRequired
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const owner = req.user.owner || req.user._id;
    const [records, expenses, loans] = await Promise.all([
      FinancialRecord.find({ owner }),
      Expense.find({ owner }).sort('date'),
      Loan.find({ owner })
    ]);

    const groupSum = (items, keyFn, valueFn) =>
      Object.values(
        items.reduce((acc, item) => {
          const key = keyFn(item) || 'Other';
          acc[key] = acc[key] || { name: key, value: 0 };
          acc[key].value += valueFn(item) || 0;
          return acc;
        }, {})
      );

    res.json({
      assetDistribution: groupSum(records, (record) => record.type, (record) => record.amount || record.dynamicFields?.currentValue || 0),
      institutionDistribution: groupSum(records, (record) => record.institution, (record) => record.amount || record.dynamicFields?.currentValue || 0),
      monthlyExpenseTrend: groupSum(expenses, (expense) => new Date(expense.date).toLocaleString('en-IN', { month: 'short', year: 'numeric' }), (expense) => expense.amount),
      upcomingMaturities: records.filter((record) => record.maturityDate).map((record) => ({ name: record.recordName, date: record.maturityDate, amount: record.amount })),
      loanStatusOverview: groupSum(loans, (loan) => loan.status, (loan) => loan.principalAmount)
    });
  } catch (error) {
    next(error);
  }
};
