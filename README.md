## DocuFin

Minimal multi-tenant document workspace for the technical vetting assignment.

## Backend Setup

From the `server` directory:

```bash
npm install
Copy-Item .env.example .env
npm run db:init
npm run dev
```

Set `DATABASE_URL` and `JWT_SECRET` in `server/.env` before running the database init or API server.

The seed script creates one tenant, one user, and several documents. Seed login:

```text
email: admin@acme-finance.test
password: Password123!
```

The API runs on `http://localhost:3000` by default.

## Backend Scripts

```bash
npm run db:init  # recreate and seed the PostgreSQL database
npm run dev      # start the API with nodemon
npm run build    # compile TypeScript
npm run lint     # run ESLint
```

## API Summary

- `POST /api/login` with `{ "email": "...", "password": "..." }`
- `GET /api/document` lists documents for the authenticated tenant
- `GET /api/document?search=tax` searches tenant documents by title
- `PATCH /api/document/:documentId/status` with `{ "status": "draft" | "awaiting_signature" | "signed" }`
