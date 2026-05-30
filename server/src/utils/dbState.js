import mongoose from 'mongoose';

export const isDatabaseReady = () => mongoose.connection.readyState === 1;
