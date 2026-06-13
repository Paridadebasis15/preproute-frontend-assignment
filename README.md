# Preproute Frontend Developer Task

A production-ready React CRA implementation of the Preproute Test Management Application assignment.

## Tech Stack

- React CRA
- JavaScript
- React Router v6
- Context API + useReducer
- Axios
- React Hook Form
- Yup validation
- Bootstrap + custom CSS
- Lazy-loaded routes
- Centralized config/constants/API utilities

## API Base URL

The application reads the API URL from CRA environment variables.

```env
REACT_APP_API_BASE_URL=https://admin-moderator-backend-staging.up.railway.app/api
```

For local development, keep this in `.env` at the project root. For deployment, add the same variable in Vercel/Netlify environment settings.

## Test Credentials

```txt
User ID: vedant-admin
Password: vedant123
```

## Features Implemented

- Login with JWT authentication
- Protected routes
- Sidebar and top navigation matching Figma direction
- Dashboard with card-based test list
- Create/Edit test flow
- Subject, topic, and subtopic API integration
- Multi-select topic/subtopic support
- Form validation using React Hook Form + Yup
- Question creation workspace
- Add/edit/delete questions locally before bulk submit
- Bulk question creation API integration
- Preview and publish screen
- Publish test API integration
- Lazy-loaded route chunks
- API response handling and centralized Axios interceptor
- Token persistence using localStorage
- Skeleton loaders and loading states
- Responsive layout

## Folder Structure

```txt
src/
├── api/              # Axios client and API services
├── components/       # Reusable UI components
├── config/           # Application config
├── constants/        # Routes and static options
├── context/          # Auth and test flow state
├── hooks/            # Reserved for reusable custom hooks
├── layouts/          # App shell/sidebar/header layout
├── pages/            # Route-level pages
├── routes/           # Route configuration and guards
├── styles/           # Global CSS
└── utils/            # Token, cache, and API helpers
```

## Technical Decisions

### CRA instead of Vite
The app uses Create React App because the requirement was to build with React CRA-compatible structure.

### Context API
Context API with reducers is used for authentication and active test flow state. This keeps the state layer simple, readable, and appropriate for assignment scope without introducing Redux overhead.

### Lazy Loading
Route-level lazy loading is implemented using `React.lazy` and `Suspense`. This keeps the initial bundle lighter and improves perceived load performance.

### API Layer
All API calls are placed inside dedicated service files under `src/api`. The Axios instance handles base URL, timeout, headers, JWT authorization, and 401 logout behavior centrally.

### Constants and Config
Routes, fixed dropdown values, API base URL, storage keys, and timeout configuration are separated into `constants` and `config` files to keep components clean and maintainable.

### Form Validation
React Hook Form and Yup are used for scalable validation with better performance and cleaner form components.

## Setup

```bash
npm install
npm start
```

If CRA dependency mismatch appears on Windows, run:

```bash
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install ajv@8 ajv-keywords@5 --save-dev
npm install
npm start
```

## Production Build

```bash
npm run build
```

## Deployment Notes

For Vercel or Netlify, add this environment variable:

```env
REACT_APP_API_BASE_URL=https://admin-moderator-backend-staging.up.railway.app/api
```

Then build command:

```bash
npm run build
```

Publish directory:

```txt
build
```
