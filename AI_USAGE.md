# AI Usage

This document shows the prompts I used with AI, why I used them and where during development I used them.

## 1. Backend Scaffold Planning

For my first prompt, I used to chatgpt to refine my scaffolding prompt to be used with codex.

**Prompt**:

```
In /server, scaffold a node.js + express + typescript api project and install the following npm libraries: express, cors, dotenv, bcrypt, jsonwebtoken, pg, typescript, nodemon, and @types/* for all the above.

It should have its routes, services, middleware, db config, and db schema all in separate folders that come together in a /server/app.js file such that any of the above file types can simply be created in the corresponding folder and then plugged in in app.js."
```

**Response**:

```
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
```


## 2. Backend Scaffold

My first Codex prompt.

**Prompt**:

The exact response I received from ChatGPT, but I did add the following line to the end of it:

```
Create an `.env.example` file containing the environment variables that will so far be required based on the installed packages.
```

**Outcome**:


