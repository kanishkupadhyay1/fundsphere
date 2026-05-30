import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true, default: Date.now },
    amount: { type: Number, required: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, trim: true }
  },
  { timestamps: true }
);

expenseSchema.index({ category: 'text', description: 'text' });

export default mongoose.model('Expense', expenseSchema);
