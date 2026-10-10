# Inkling 🍃

**A quiet place to think, write, and remember.**

Inkling is a private journaling web application built to help you capture your thoughts, document your days, track your moods, and revisit meaningful memories in one place.

Designed with a warm, minimalist interface, Inkling aims to make journaling feel simple, personal, and distraction-free.

**Private by design. Only you can read what you write.**

---

## ✨ Features

- **Personal Diary:** Create, view, update, and delete journal entries.
- **Entry Organization:** Categorize entries as diary, thought, coding, memory, or other.
- **Mood Tracking:** Associate moods with journal entries and view mood statistics.
- **Search & Filtering:** Search entries and filter by type, mood, favorite status, and date range.
- **Favorites:** Mark important entries for quick access.
- **Calendar:** Explore journal entries by month.
- **On This Day:** Revisit entries from the same date in previous years.
- **Drafts & Completed Entries:** Keep entries in different writing states.
- **Authentication:** Register, log in, and log out securely.
- **Private Data:** Protect journal endpoints and restrict entry access to the authenticated user.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Routing | React Router |
| State Management | Zustand |
| HTTP Client | Axios |
| Styling | Plain CSS |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens, bcryptjs, HTTP-only cookies |
| Middleware | CORS, cookie-parser, Express JSON parsing |

---

## 📁 Project Structure

```text
personal-space/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/              # API clients and requests
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React context
│   │   ├── data/             # Static or shared data
│   │   ├── lib/              # Client-side utilities
│   │   ├── pages/            # Application pages
│   │   ├── store/            # Zustand stores
│   │   ├── styles/           # CSS stylesheets
│   │   ├── types/            # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── .gitignore
│
├── server/
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   ├── controllers/      # Request handlers
│   │   ├── lib/              # Backend utilities
│   │   ├── middleware/       # Authentication middleware
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # API route definitions
│   │   ├── types/            # TypeScript type declarations
│   │   └── index.ts           # Express application entry point
│   ├── dist/                 # Compiled output
│   ├── package.json
│   ├── .gitignore
│   └── .env                  # Local environment variables (not committed)
│
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB database, either locally or through MongoDB Atlas
- Git

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd personal-space
```

Replace `<YOUR_REPOSITORY_URL>` with your repository URL.

### 2. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=3000
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_random_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Use the environment variable names expected by your implementation. Never commit `.env` or expose your database credentials or JWT secret.

### 3. Start the backend

Run the development script configured in `server/package.json`. For example, if the script is named `dev`:

```bash
npm run dev
```

The API will run on the configured port. The default port in the current server entry point is `3000`.

### 4. Configure the frontend

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file inside `client/`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Ensure the Axios configuration uses this base URL, or adjust it to match the actual API URL configured in the frontend.

### 5. Start the frontend

Run the development script configured in `client/package.json`. If the script is named `dev`:

```bash
npm run dev
```

Open the local URL printed in the terminal by Vite.

---

## 🔌 API Documentation

The backend uses the `/api/v1` prefix for application routes.

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check whether the API is running |

### Authentication

Base path: `/api/v1/users`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/users/register` | Register a new user |
| POST | `/api/v1/users/login` | Authenticate a user |
| POST | `/api/v1/users/logout` | Log out the current user |
| GET | `/api/v1/users/me` | Retrieve the authenticated user's information |

The `/me` endpoint is protected by authentication middleware.

### Journal Entries

Base path: `/api/v1/entry`

All endpoints below are protected by authentication middleware.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/entry/create` | Create a journal entry |
| GET | `/api/v1/entry/all-entries` | Retrieve journal entries |
| GET | `/api/v1/entry/create/:id` | Retrieve a specific entry |
| PATCH | `/api/v1/entry/update/:id` | Update an entry |
| DELETE | `/api/v1/entry/delete/:id` | Delete an entry |
| GET | `/api/v1/entry/calendar?month=YYYY-MM` | Retrieve calendar entries |
| GET | `/api/v1/entry/memories` | Retrieve memories from previous years |
| GET | `/api/v1/entry/mood-stats?from=YYYY-MM-DD&to=YYYY-MM-DD` | Retrieve mood statistics for a date range |

**Note:** The endpoint paths above match the supplied Express route definitions. The calendar, memories, and mood-statistics endpoints are also protected because `protectRoute` is applied to the entire entry router.

---

## 🔐 Authentication & Security

Inkling uses JWT-based authentication with HTTP-only cookies.

- Passwords are hashed before storage.
- Authentication middleware verifies protected requests.
- HTTP-only cookies prevent normal frontend JavaScript from reading the authentication token.
- Entry operations must be scoped to the authenticated user's ID.
- Credentialed CORS allows the configured frontend origin to communicate with the backend.

### Production security checklist

- Serve the application over HTTPS.
- Enable secure cookies in production.
- Restrict CORS to trusted frontend origins.
- Keep secrets in deployment environment variables.
- Restrict MongoDB network access and database permissions.
- Review CSRF protection, request validation, rate limiting, and session revocation.
- Never commit environment files, credentials, or private tokens.

HTTP-only cookies improve token protection but do not eliminate all session theft or cross-site request risks.

---

## 🚀 Deployment

Inkling can be deployed using separate hosting services for the frontend, backend, and database.

| Component | Example service |
|---|---|
| Frontend | [Vercel](https://vercel.com/) |
| Backend | [Render](https://render.com/) |
| Database | [MongoDB Atlas](https://www.mongodb.com/atlas) |

Before deploying:

1. Verify that both applications build successfully.
2. Configure all production environment variables.
3. Set `VITE_API_URL` to the deployed API base URL.
4. Set `CLIENT_URL` to the deployed frontend origin.
5. Configure HTTPS, credentialed CORS, and cookie settings.
6. Test registration, login, logout, and authenticated requests.
7. Verify entry creation, updates, deletion, search, filters, calendar, memories, and mood statistics.
8. Confirm that one user cannot access another user's journal entries.

---

## 🎯 Learning Objectives

This project explores:

- Full-stack development with React and Express.
- REST API design and database modeling.
- JWT authentication and cookie-based sessions.
- Protected routes and user-specific data access.
- MongoDB queries, filtering, and aggregation.
- Frontend state management and API integration.
- Responsive interface development using plain CSS.
- Production configuration and deployment.

---

## 🌱 Future Improvements

Potential future enhancements include:

- Rich-text or Markdown editing.
- Export and import of journal entries.
- Advanced mood analytics and visualizations.
- Session management and token revocation.
- Automated backups and account recovery.
- Additional privacy and data-encryption options.

These are planned possibilities rather than claims about the current implementation.

---

## 📄 License

Add a license file if you intend to distribute the project under an open-source license.

---

**Inkling — a little space for everything on your mind.** 🍃