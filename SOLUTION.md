**Note**:

> This document is best viewed in Visual Studio Code (or another Markdown editor with heading folding enabled). The AI prompt/response sections are grouped under collapsible headings so reviewers can easily skip over them if they prefer to focus on the implementation and design decisions.

**AI Strategy**:

> My general AI strategy for this project is to offload initialisation and as much scaffolding work as possible to Codex, while I code the implementation details myself. And for scaffolding tasks I was sure to give as much detail as possible so that I can retain control of the architecture of the project.


# Backend

## Scaffolding

For my first prompt, I used ChatGPT to refine my scaffolding prompt to be used with Codex.

### Prompt:

In /server, scaffold a node.js + express + typescript api project and install the following npm libraries: express, cors, dotenv, bcrypt, jsonwebtoken, pg, typescript, nodemon, and @types/* for all the above.

It should have its routes, services, middleware, db config, and db schema all in separate folders that come together in a /server/app.js file such that any of the above file types can simply be created in the corresponding folder and then plugged in in app.js."

### Response:

Scaffold a Node.js + Express + TypeScript REST API project in /server.

Install and configure:

- express
- cors
- helmet
- dotenv
- bcrypt
- jsonwebtoken
- pg
- typescript
- tsx
- nodemon
- eslint
- prettier
- all required @types/* packages

Create the following folder structure:

src/
    app.ts
    index.ts
    config/
    middleware/
    routes/
    services/
    validators/
    types/
    utils/
    db/

Wire the application together so that new routes, middleware and services can easily be added.

Configure Express with JSON parsing, CORS, Helmet, environment variables and a global error handler.

Do not implement business logic.

Create placeholder route files and service files containing TODO comments and stub methods only.

Create a PostgreSQL connection module using pg, but do not define the schema beyond an empty schema.sql and seed.sql.

Configure npm scripts for development, build and start.

The result should be a clean scaffold suitable for implementing a small REST API manually.


### Outcome:

I then took the exact response I got from chatgpt and gave it to Codex, adding only the following line to the end:

"Create an `.env.example` file containing the environment variables that will so far be required based on the installed packages."

Codex scaffolded the application almost exactly as I expected except for a few over complexities that it created to fill the folders I asked for, like an unnecessary type that was only used in one other place. I corrected overzealous instances like that and also decided to remove several folders until they're actually needed, for simplicity.


## Database Design

During development I used a hosted Supabase PostgreSQL instance to avoid requiring a local Postgres installation. The application itself is provider-agnostic and uses a standard PostgreSQL connection string. Schema and seed scripts are included so reviewers can initialise any PostgreSQL database locally or remotely.


## Schema and Seed Creation

I started out by reviewing how to work with SQL and the relevant syntax before attempting to write my own schema file. Then I asked ChatGPT to review and improve it for me.

### Prompt:

Here's my schema.sql. Review it and give me the optimal version of the queries in terms of data types and constraints based on the property names.

```
DROP TABLE tenants IF EXISTS;
DROP TABLE users IF EXISTS;
DROP TABLE documents IF EXISTS;

CREATE TABLE tenants (
  id BIGINT PRIMARY KEY,
  name VARCHAR(255) REQUIRED NOT NULL,
);

CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE documents (
  id BIGINT PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenant(id),
  identifier VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  status VARCHAR(255) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'signed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (tenant_id, identifier)
);
```

### Response:

```
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS tenants;

CREATE TABLE tenants (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL
);

CREATE TABLE documents (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id),
  identifier TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'awaiting_signature', 'signed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (tenant_id, identifier)
);
```

### Outcome:

I copy/pasted the improved code ChatGPT gave me and followed the exact same strategy for creating the `seed.sql` file.


## Database Initialisation Script

Once I had the schema and seed sql scripts in place, I wrote the `server/src/db/init.ts` script which will automatically set up the tables in the database as well as seed each table with one record each. For the user seed, I made sure to include a bcrypt hashing step so that no further work is required when reviewing the login flow. The `init.ts` script can be run as an npm command as `npm run db:init` from the `/server` directory.

This will give you a user that can be logged in with the following details:

email address: admin@acme-finance.test
password: *to be set in `server\src\db\init.ts` before running the script*


## Login Route

For the login route, I created the POST route `/api/login` in `server/src/routes/login.routes.ts`.

- First I check the request for an email and password and if either of them are not present I throw a 400 error letting the user know to enter an email and password.
- Next the email and password is forwarded to the login service's (`server\src\services\login.service.ts`) `login` function.
- I start by querying the `users` table for a user with a matching email address and if it doesn't exist, I throw a 401 and let the user know the email _or password_ is incorrect. I don't distinguish between which one is incorrect for security reasons.
- If the user is found, I do a `bcrypt.compare()` between the entered password and the db entity's password hash. If it's not a match, I throw the exact same 401 error, for the same security reason.
- Finally, if the passwords match, I generate and sign a new JWT using the JWT Secret that's stored in `.env`, which contains the user's id, email address and tenant_id and send it as the response to a client.

At this point I asked Codex to review my changes and apply any better solutions. The diff of what I wrote can be seen [here](https://github.com/LeeGrobler/docu-fin/commit/a1b9659c649a7fba0019f38ebbdba8c265686551) and the diff of Codex's updates can be seen [here](https://github.com/LeeGrobler/docu-fin/commit/a4bd8ee9a9d6bfa8ea23f94ab4d4ee5a74b92651).

### Prompt:

Review my staged changes and apply patches to any medium or higher problems.

### Outcome:

Codex applied three changes:

- Updated login route to reject non-string params.
- Updated login service to only select required properties. 
- Updated .env config to fail if no jwtSecret exists.


## Authentication Middleware

I created the authentication middleware (`server\src\middleware\authHandler.ts`) to confirm that a valid bearer token is attached to all document requests and to inform the downstream route of the request's tenant and user details.

I again asked Codex to review my changes but found that it's suggested improvements were either invalid or minor enough to ignore.

## Document routes

For the routes, I created the get all documents GET route in tandem with the authentication middleware to make sure only authenticated users can access documents that belong to their tenant. This was also the first time I created an external domain type, `Document` (`server\src\types\Document.ts`) because the type is shared among several files. If it was only required by one file I'd have declared it in the file that consumes it, as is the case with `LoginUser` in `server\src\services\login.service.ts`.

To achieve that, I start by confirming that the tenantId established in the auth middleware exists and if it doesn't, I return a 400 error. Then in the documentService I do a parameterized pg query to select the visible document fields owned by the tenant. The list route also accepts an optional `search` query param, which searches document titles with `ILIKE` while keeping the tenant filter in the same SQL query. Finally, I convert it to an array of documents that only contain the document fields that the user should see before returning the array to the client.

To update a document's status, I created a patch route that takes the document id as a URL path param and the new document status as a request body field. I check if the id and status are present and valid and return a 400 error if they're not, otherwise I pass them to the documentService where I use a SQL `UPDATE` to update the document. In the SQL query I pass the document id and tenant id as `WHERE` arguments so that if a user tries to update a document that's not of their tenant, it will fail. Then I return the updated document to the client.

Tenant scoping is enforced by deriving `tenantId` from the verified JWT in the auth middleware and using it in every document query. Listing uses `WHERE tenant_id = $1`, and status updates use `WHERE id = $2 AND tenant_id = $3`, so a document from another tenant will not be returned or updated even if its id is known.

For this small assignment I did not add pagination because it was explicitly out of scope. For a larger dataset, the first performance improvement would be adding indexes such as `documents(tenant_id)` for tenant filtering and `documents(tenant_id, title)` for tenant-scoped title search.

I again asked Codex to review my changes but found that it's suggested improvements were either invalid or minor enough to ignore.


# Frontend

## Scaffolding

Similar to the backend I asked Codex to scaffold a frontend react app with the following prompt:

### Prompt:

Scaffold a React app in a /client directory based on the provided assessment requirements and existing backend. Install the minimum necessary packages required to interface with the backend, as well as MUI for styling/components. Only scaffold the application and project structure and do not write any feature implementation code.

### Outcome:

Codex scaffolded an empty Vite/React/Typescript with MUI as the component library.


## Routes Setup

Because Codex didn't include react router in its scaffold step (I should've asked it to, to be fair), I manually set up react router, an empty navbar, and the empty pages that will be on the site, which is /home, /login, and /documents.


## App Layout and Home Page

I setup the basic navbar with a logo, links and action buttons. I also asked Codex to setup a dummy home page with the following prompt and everything seen on `client/src/pages/home.page.tsx` is what Codex setup, with me only removing some of its excesses.

### Prompt:

Set up a nice on-brand, assessment-relevant landing page here (*home page*), with a CTA to log in.


## App State and Authentication

For the frontend authentication state I created an `AuthProvider` in `client/src/context/auth.context.tsx` which stores the JWT token in localStorage and exposes the logged in state to the rest of the app. I also added a small `useAuth()` helper in the same file so that components don't have to repeat the null check every time they need the auth context.

The login page (`client/src/pages/login.page.tsx`) keeps the email, password, loading state and error message as local component state. When the form is submitted it calls the `login` function from the auth context, which then uses `client/src/api/client.ts` to call the backend's `/api/login` route. The api client reads `VITE_API_BASE_URL` from the client's `.env` file, so the frontend is not dependant on the backend running on a hardcoded URL.

For routing, I added a `ProtectedRoute` component which redirects unauthenticated users away from `/documents` and a `GuestRoute` component which does the opposite for `/login`. I also moved the navbar into an app layout route so that it still sits above all pages, but can use React Router links instead of normal anchor links, which avoids a full page refresh when navigating around the app.

Finally I updated the navbar and home page actions to only show routes that the user can actually access. If a user is logged out they only see the home and login actions. If they're logged in, the navbar links them to documents and gives them a logout button instead.


## Documents

For the documents page, I kept the frontend architecture at the same level as the login flow. I added the document api calls to `client/src/api/client.ts`, so the page itself doesn't need to know how the backend URL or authorization headers are put together. The list request calls `GET /api/document` and the update request calls `PATCH /api/document/:documentId/status`, both using the JWT token from the auth context.

In `client/src/pages/documents.page.tsx`, I keep the documents array, search input, loading state, update state and error message as local page state. When the page loads it fetches the tenant's documents from the backend and displays them in a basic MUI table. The search form forwards the search text as a query param so that it uses the backend's existing title search instead of filtering client side.

I also added a simple status dropdown for each document row. When the selected status changes, the page calls the update endpoint and replaces the updated document in local state with the response from the server. If the backend returns an unauthorized response, the page calls `logout()` from the auth context so that the user is sent back through the normal authentication flow.

