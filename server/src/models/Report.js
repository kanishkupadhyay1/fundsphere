import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['Asset Summary', 'Due Report', 'Maturity Report', 'Loan Report', 'Expense Report', 'Nominee Report', 'Institution Report'], required: true },
    filters: Object,
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fileUrl: String
  },
  { timestamps: true }
);

export default mongoose.model('Report', reportSchema);
