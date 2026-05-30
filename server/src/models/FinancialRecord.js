import mongoose from 'mongoose';

const dynamicFieldsSchema = new mongoose.Schema(
  {
    fdNumber: String,
    interestRate: Number,
    branch: String,
    autoRenewal: Boolean,
    policyNumber: String,
    premiumAmount: Number,
    premiumFrequency: String,
    nextDueDate: Date,
    accountNumber: String,
    ifsc: String,
    accountType: String,
    folioNumber: String,
    fundName: String,
    sipAmount: Number,
    propertyType: String,
    address: String,
    purchaseDate: Date,
    currentValue: Number
  },
  { _id: false }
);

const financialRecordSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['Bank Account', 'Fixed Deposit', 'Recurring Deposit', 'Insurance Policy', 'Mutual Fund', 'PPF', 'NPS', 'Bond', 'Gold', 'Property', 'Pension', 'SCSS', 'NSC', 'KVP', 'Other'],
      required: true
    },
    institution: { type: String, required: true, trim: true, index: true },
    recordName: { type: String, required: true, trim: true },
    referenceNumber: { type: String, trim: true },
    amount: { type: Number, default: 0 },
    nominee: { type: String, trim: true },
    startDate: Date,
    maturityDate: Date,
    status: { type: String, enum: ['Active', 'Matured', 'Closed', 'Inactive'], default: 'Active' },
    notes: String,
    dynamicFields: dynamicFieldsSchema,
    documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }]
  },
  { timestamps: true }
);

financialRecordSchema.index({ recordName: 'text', referenceNumber: 'text', institution: 'text', nominee: 'text' });

export default mongoose.model('FinancialRecord', financialRecordSchema);
