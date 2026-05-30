import mongoose from 'mongoose';

const repaymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    notes: String
  },
  { timestamps: true }
);

const loanSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    direction: { type: String, enum: ['Money Given', 'Money Taken'], required: true },
    personName: { type: String, required: true, trim: true },
    mobile: String,
    address: String,
    notes: String,
    principalAmount: { type: Number, required: true },
    interestRate: { type: Number, default: 0 },
    interestType: { type: String, enum: ['Simple Interest', 'Compound Interest'], default: 'Simple Interest' },
    loanDate: { type: Date, required: true },
    dueDate: Date,
    status: { type: String, enum: ['Active', 'Partially Paid', 'Fully Paid', 'Overdue'], default: 'Active' },
    repayments: [repaymentSchema]
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

loanSchema.virtual('totalRepaid').get(function totalRepaid() {
  return this.repayments.reduce((sum, repayment) => sum + repayment.amount, 0);
});

loanSchema.virtual('outstandingPrincipal').get(function outstandingPrincipal() {
  return Math.max(this.principalAmount - this.totalRepaid, 0);
});

loanSchema.methods.calculateInterest = function calculateInterest(asOf = new Date()) {
  const start = new Date(this.loanDate);
  const years = Math.max((asOf - start) / (1000 * 60 * 60 * 24 * 365), 0);
  const rate = this.interestRate / 100;
  if (this.interestType === 'Compound Interest') {
    return Math.max(this.principalAmount * Math.pow(1 + rate, years) - this.principalAmount, 0);
  }
  return Math.max(this.principalAmount * rate * years, 0);
};

loanSchema.index({ personName: 'text', mobile: 'text' });

export default mongoose.model('Loan', loanSchema);
