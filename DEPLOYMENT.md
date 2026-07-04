# FundSphere Deployment

FundSphere deploys as a Vercel frontend, a Render backend, and a MongoDB Atlas database.

## Frontend Environment Variables

Set this in Vercel before building:

```bash
VITE_API_URL=<your Render backend URL, with or without /api>
```

The frontend normalizes this value so requests always resolve to `/api` exactly once.

## Backend Environment Variables

Set these in Render. Do not commit real secrets.

```bash
NODE_ENV=production
PORT=<provided by Render>
MONGODB_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<long random production secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=<your Vercel frontend URL>
CLOUDINARY_NAME=<required for document upload>
CLOUDINARY_API_KEY=<required for document upload>
CLOUDINARY_API_SECRET=<required for document upload>
```

## Render Settings

```bash
Root Directory: server
Build Command: npm install
Start Command: npm start
```

The included `render.yaml` mirrors these settings.

## Vercel Settings

```bash
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Root Directory: client
```

The included `client/vercel.json` preserves SPA routing.

## Deployment Verification

After deployment, verify:

```text
GET <backend-url>/health
GET <backend-url>/api/routes
POST <backend-url>/api/auth/register
POST <backend-url>/api/auth/login
```
