import Document from '../models/Document.js';
import FinancialRecord from '../models/FinancialRecord.js';
import Loan from '../models/Loan.js';

export const globalSearch = async (req, res, next) => {
  try {
    const owner = req.user.owner || req.user._id;
    const q = req.query.q || '';
    const pattern = { $regex: q, $options: 'i' };

    const [records, loans, documents] = await Promise.all([
      FinancialRecord.find({
        owner,
        $or: [
          { recordName: pattern },
          { referenceNumber: pattern },
          { institution: pattern },
          { nominee: pattern },
          { 'dynamicFields.fdNumber': pattern },
          { 'dynamicFields.policyNumber': pattern },
          { 'dynamicFields.accountNumber': pattern }
        ]
      }).limit(10),
      Loan.find({ owner, personName: pattern }).limit(10),
      Document.find({ owner, name: pattern }).limit(10)
    ]);

    res.json({ records, loans, documents });
  } catch (error) {
    next(error);
  }
};
