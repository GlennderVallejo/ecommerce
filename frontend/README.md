# Pardrit Frontend

React storefront for Pardrit, a PC hardware e-commerce portfolio project.

The frontend provides a product catalog, category browsing, account registration and login, a shopping cart, and demo checkout. It communicates with the Spring Boot REST API in the repository root.

## Stack

- React 19
- Vite 8
- JavaScript and CSS

## Local development

From the `frontend` directory:

```bash
npm install
npm run dev
```

The development server typically runs at `http://localhost:5173`.

The API URL defaults to `http://localhost:8080/api`. To use a different backend, create `frontend/.env.local`:

```dotenv
VITE_API_URL=http://localhost:8080/api
```

## Build

```bash
npm run build
npm run preview
```

The Vite base path is configured as `/ecommerce/` for GitHub Pages deployment.

For backend setup, API endpoints, and project details, see the [main README](../README.md).
