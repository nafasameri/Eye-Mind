# EyeMind Web

React marketing + Auth/Commercial console for EyeMind retinal screening.

## Stack

- Vite + React + TypeScript
- React Router, TanStack Query, react-i18next (FA/EN + RTL)

## Setup

```bash
npm install
npm run dev
```

API / CORS (`.env`):

```
VITE_API_BASE_URL=/api/v1
VITE_API_PROXY_TARGET=http://192.168.67.36
```

In development the browser calls same-origin `/api/...` and Vite proxies to `VITE_API_PROXY_TARGET`, so CORS is avoided. Restart `npm run dev` after changing env.

## Docs

See [docs/FRONTEND_AUTH_API.md](docs/FRONTEND_AUTH_API.md) for endpoint contracts.
