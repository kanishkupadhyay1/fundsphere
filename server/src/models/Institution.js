import mongoose from 'mongoose';

const institutionSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    branch: { type: String, trim: true },
    contactDetails: {
      phone: String,
      email: String,
      address: String,
      website: String
    },
    notes: String
  },
  { timestamps: true }
);

institutionSchema.index({ name: 'text', type: 'text', branch: 'text' });

export default mongoose.model('Institution', institutionSchema);
