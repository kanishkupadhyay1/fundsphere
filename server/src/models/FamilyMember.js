import mongoose from 'mongoose';

const familyMemberSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    mobile: String,
    relationship: String,
    status: { type: String, enum: ['Invited', 'Active', 'Removed'], default: 'Invited' },
    permissions: {
      viewRecords: { type: Boolean, default: true },
      viewDocuments: { type: Boolean, default: true },
      viewReports: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

export default mongoose.model('FamilyMember', familyMemberSchema);
