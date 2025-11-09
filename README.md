# Bet Dashboard Hub

A modern dashboard application for managing betting platform operations.

## Environment Setup

This project uses environment variables for configuration. Follow these steps to set up:

1. Copy the `.env.example` file to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Update the environment variables in `.env` according to your setup:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_API_URL=http://localhost:8000
   ```

### Environment Variables

- `VITE_API_BASE_URL`: The base URL for API calls (default: `http://localhost:8000/api`)
- `VITE_API_URL`: The base URL for static assets like images (default: `http://localhost:8000`)

**Note**: In Vite, environment variables must be prefixed with `VITE_` to be exposed to the client-side code.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Production

After building, you can preview the production build:

```bash
npm run preview
```
