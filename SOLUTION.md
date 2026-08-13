**Note**:

> This document is best viewed in Visual Studio Code (or another Markdown editor with heading folding enabled). The AI prompt/response sections are grouped under collapsible headings so reviewers can easily skip over them if they prefer to focus on the implementation and design decisions.

**AI Strategy**:

> My general AI strategy for this project is to offload initialisation and as much scaffolding work as possible to Codex, while I code the implementation details myself. And for scaffolding tasks I was sure to give as much detail as possible so that I can retain control of the architecture of the project.


## Backend Scaffolding

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

Once I had the schema and seed sql scripts in place, I wrote the `server/src/db/init.ts` script that will automatically set up the tables in the database as well as seed each table with one record each. For the user seed, I made sure to include a bcrypt hashing step so that no further work is required when reviewing the login flow. The `init.ts` script can be run as an npm command as `npm run db:init` from the `/server` directory.


