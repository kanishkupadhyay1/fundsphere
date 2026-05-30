import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['Maturity', 'Premium Due', 'Loan Due', 'Missing Nominee', 'Missing Information', 'Document Expiry', 'Overdue Loan'], required: true },
    severity: { type: String, enum: ['info', 'success', 'warning', 'urgent'], default: 'info' },
    dueDate: Date,
    isRead: { type: Boolean, default: false },
    link: String
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
