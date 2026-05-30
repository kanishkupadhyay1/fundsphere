# Kubera Deployment

Kubera can be deployed as one Node.js web service. The Express server serves the API under `/api` and serves the built React app from `client/dist` in production.

## Required Environment Variables

Set these in your hosting provider dashboard. Do not commit `.env` files.

```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<long random production secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=<your deployed app URL>
CLOUDINARY_CLOUD_NAME=<optional, required for document upload>
CLOUDINARY_API_KEY=<optional, required for document upload>
CLOUDINARY_API_SECRET=<optional, required for document upload>
```

## Build And Start Commands

Use these commands for a single-service deployment:

```bash
npm install
npm run build
npm start
```

For Render, the typical settings are:

```bash
Build Command: npm install && npm run build
Start Command: npm start
```

## Local Production Check

```bash
npm run build
set NODE_ENV=production
npm start
```

Then open:

```text
http://localhost:5000
http://localhost:5000/health
```
