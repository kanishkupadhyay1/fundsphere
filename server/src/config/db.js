import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('MONGODB_URI must be configured in production.');
    }
    console.warn('MONGODB_URI is not set. API will fail database operations until configured.');
    return;
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000
  });
  console.log('MongoDB connected');
};

export default connectDB;
