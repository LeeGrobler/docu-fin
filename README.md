## DocuFin

Minimal multi-tenant document workspace for the technical vetting assignment.

## Backend Setup

From the `server` directory:

```bash
npm install
```

Create the `.env` file first:

```bash
# Windows PowerShell
Copy-Item .env.example .env

# macOS/Linux bash
cp .env.example .env
```

Set `DATABASE_URL` and `JWT_SECRET` in `server/.env` before running the database init or API server.

Then run:

```bash
npm run db:init
npm run dev
```

The seed script creates one tenant, one user, and several documents. Seed login:

```text
email: admin@acme-finance.test
password: Password123!
```

The API runs on `http://localhost:3000` by default.

## Frontend Setup

From the `client` directory:

```bash
npm install
```

Create the `.env` file first:

```bash
# Windows PowerShell
Copy-Item .env.example .env

# macOS/Linux bash
cp .env.example .env
```

Set `VITE_API_BASE_URL` in `client/.env` if the backend is not running on `http://localhost:3000`.

Then run:

```bash
npm run dev
```

The client runs on `http://localhost:5173` by default.

## Backend Scripts

```bash
npm run db:init  # recreate and seed the PostgreSQL database
npm run dev      # start the API with nodemon
npm run build    # compile TypeScript
npm run lint     # run ESLint
```

## Frontend Scripts

```bash
npm run dev      # start the Vite dev server
npm run build    # compile TypeScript and build the client
npm run lint     # run oxlint
```

## API Summary

- `POST /api/login` with `{ "email": "...", "password": "..." }`
- `GET /api/document` lists documents for the authenticated tenant
- `GET /api/document?search=tax` searches tenant documents by title
- `PATCH /api/document/:documentId/status` with `{ "status": "draft" | "awaiting_signature" | "signed" }`
