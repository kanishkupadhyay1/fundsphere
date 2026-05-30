# KUBERA

**One Place for Every Financial Record**

Kubera is a production-ready MERN financial record management platform designed for senior citizens and families. It is a manual digital locker and financial registry: it does not connect to banks or financial institutions.

## Features

- JWT authentication with role-based owner and family-member access.
- Financial records for bank accounts, FDs, RDs, insurance, mutual funds, PPF, NPS, bonds, gold, property, pension, SCSS, NSC, KVP, and other assets.
- Due center for maturities, premiums, loan dues, overdue items, and missing information.
- Nominee tracker, institution management, loan ledger, expense tracker, document vault, reports, analytics, notifications, family access, emergency contacts, and global search.
- Senior-friendly React UI with large controls, high contrast, responsive navigation, loading, empty, and error states.
- Express MVC backend with Mongoose models, validation, pagination, search, filtering, Cloudinary uploads, security headers, rate limiting, XSS and Mongo injection protection.

## Quick Start

1. Copy environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

2. Install dependencies:

```bash
npm run install:all
```

3. Start the development servers:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production environment variables and hosting commands.

## Project Structure

```text
client/   React, Tailwind CSS, TanStack Query, routes, pages, components
server/   Node.js, Express, MongoDB, Mongoose, JWT, Cloudinary, MVC API
```

## Developer

Kanishk Upadhyay

- Email: kanishk.upadhyay2006@gmail.com
- LinkedIn: https://www.linkedin.com/in/kanishk-upadhyay-151560335/
- GitHub: https://github.com/kanishkupadhyay1
