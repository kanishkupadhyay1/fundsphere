import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';

const port = process.env.PORT || 5000;

await connectDB();

const server = app.listen(port, () => {
  console.log(`FundSphere API running on port ${port}`);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
