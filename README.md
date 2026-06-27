# Job Application Tracker API

A RESTful API for tracking job applications through a hiring pipeline — built with Node.js and Express, backed by SQLite. This is a learning project being developed in phases.

## Features (current)

- **Applications CRUD** — create, list, fetch, update, and delete job applications, with field-level request validation and consistent JSON responses.
- **Authentication** — user registration and login with bcrypt-hashed passwords and signed JWTs; a protected `/me` endpoint gated by token-verification middleware.
- **Validation** — request bodies and route params validated with `zod`; invalid input returns `400` with details, unknown fields are rejected.
- **Central error handling** — a typed `ApiError` class plus a single error-handling middleware translate domain errors into the right HTTP status codes.
- **Safe data access** — all SQL uses prepared statements with bound parameters (no string interpolation), via Node's built-in `node:sqlite`.

> **Status:** work in progress. Authentication is complete, but applications are **not yet scoped to individual users** — per-user data ownership is the next phase (see Roadmap). Until then, the applications endpoints are unauthenticated.

## Tech stack

| Concern | Choice |
| --- | --- |
| Runtime | Node.js ≥ 22.5 |
| Web framework | Express 5 |
| Database | SQLite via built-in `node:sqlite` |
| Validation | `zod` |
| Password hashing | `bcryptjs` |
| Tokens | `jsonwebtoken` |
| Config | `dotenv` |

## Project structure

```
src/
├── app.js                 # builds and exports the Express app (no listen)
├── server.js              # imports the app and starts listening
├── lib/
│   ├── db.js              # single shared SQLite connection (FK pragma on)
│   ├── schema.sql         # table definitions
│   ├── migrate.js         # applies the schema (idempotent)
│   ├── ApiError.js        # typed error class carrying an HTTP status
│   └── jwt.js             # sign / verify JWTs
├── middleware/
│   ├── error.js           # central error-handling middleware
│   └── authenticate.js    # verifies Bearer token, sets req.user
└── modules/
    ├── applications/
    │   ├── applications.service.js     # SQL + data logic
    │   ├── applications.controller.js  # HTTP boundary
    │   ├── applications.routes.js      # router
    │   └── applications.schema.js      # zod schemas
    └── auth/
        ├── auth.service.js
        ├── auth.controller.js
        ├── auth.routes.js
        └── auth.schema.js
```

The layout separates **infrastructure** (`lib/`, `middleware/`) from **feature slices** (`modules/<feature>/`), and keeps the app definition (`app.js`) free of runtime concerns like the port (`server.js`) so the app stays testable.

## Getting started

**Prerequisites:** Node.js ≥ 22.5.

```bash
# 1. Install dependencies
npm install

# 2. Create a .env file in the project root
echo "JWT_SECRET=replace-with-a-long-random-string" > .env

# 3. Create the database (applies schema.sql)
node src/lib/migrate.js

# 4. Start the server (auto-restarts on changes)
npm run dev
```

The server listens on `http://localhost:3000`. Verify it's up:

```bash
curl http://localhost:3000/health
# → { "status": "ok" }
```

## Configuration

| Variable | Required | Description |
| --- | --- | --- |
| `JWT_SECRET` | yes | Secret used to sign and verify JWTs. Keep it out of version control. |

`.env`, `node_modules/`, and the SQLite database file are git-ignored.

## API

All responses use a consistent envelope: success is `{ "data": ... }`, errors are `{ "error": { "message": ... } }`.

### Auth

| Method | Endpoint | Auth | Description | Success |
| --- | --- | --- | --- | --- |
| POST | `/api/auth/register` | — | Register a new user; returns the user and a JWT | `201` |
| POST | `/api/auth/login` | — | Log in; returns the user and a JWT | `200` |
| GET | `/api/auth/me` | Bearer | Return the authenticated user | `200` |

Protected requests send the token in the `Authorization` header:

```
Authorization: Bearer <token>
```

### Applications

| Method | Endpoint | Description | Success | Errors |
| --- | --- | --- | --- | --- |
| POST | `/api/applications` | Create an application | `201` | `400` |
| GET | `/api/applications` | List applications | `200` | |
| GET | `/api/applications/:id` | Fetch one application | `200` | `404` |
| PATCH | `/api/applications/:id` | Partially update an application | `200` | `400`, `404` |
| DELETE | `/api/applications/:id` | Delete an application | `204` | `404` |

**Application fields:** `company` and `position` are required; `status` (defaults to `WISHLIST`), `location`, and `notes` are optional. Timestamps (`created_at`, `updated_at`) are managed automatically.

### Example

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@example.com","password":"supersecret","name":"You"}'

# Create an application
curl -X POST http://localhost:3000/api/applications \
  -H 'Content-Type: application/json' \
  -d '{"company":"Acme","position":"Backend Engineer","status":"APPLIED"}'
```

## License

MIT © Maksymilian Dębiński
