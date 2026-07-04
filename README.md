# FundSphere

AI-Powered Wealth and Liability Management Platform

FundSphere is a MERN financial management platform for tracking assets, liabilities, expenses, documents, reports, notifications, institutions, family access, and future AI-powered financial insights.

## Features

- JWT authentication with protected routes.
- Financial records, loans, expenses, documents, reports, notifications, dashboard, analytics, institutions, and family access.
- Centralized Axios API client with normalized `/api` base URL handling.
- Express API with Mongoose models, validation, security middleware, file-upload support, and route diagnostics.
- Deployment-ready configuration for Vercel, Render, and MongoDB Atlas.

## Local Setup

1. Copy environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

2. Fill in the required values in both `.env` files.

3. Install dependencies:

```bash
npm run install:all
```

4. Start development servers:

```bash
npm run dev
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production environment variables and hosting commands.
