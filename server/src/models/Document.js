import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['FD Receipt', 'Insurance Policy', 'Property Paper', 'Bank Statement', 'Pension Record', 'Aadhaar', 'PAN', 'Passport', 'Other'],
      default: 'Other'
    },
    relatedRecord: { type: mongoose.Schema.Types.ObjectId, ref: 'FinancialRecord' },
    fileUrl: { type: String, required: true },
    publicId: String,
    mimeType: String,
    size: Number,
    expiryDate: Date,
    notes: String
  },
  { timestamps: true }
);

documentSchema.index({ name: 'text', type: 'text' });

export default mongoose.model('Document', documentSchema);
