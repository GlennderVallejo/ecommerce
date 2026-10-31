# Pardrit

Pardrit is a full-stack e-commerce project focused on PC hardware. I built it to practice backend development with Java and Spring Boot while connecting a React storefront to a PostgreSQL database.

The application supports browsing products, creating an account, managing a shopping cart, and placing demo orders. It is a portfolio project, not a live retail store.

## Tech stack

**Backend:** Java 21, Spring Boot 4, Spring Security, Spring Data JPA, PostgreSQL, JWT, BCrypt, Maven, Swagger / OpenAPI

**Frontend:** React 19, Vite 8, JavaScript, CSS

**Deployment:** Google Cloud Run for the backend and Neon for hosted PostgreSQL

## Features

- Product and category catalog served by a REST API
- Account registration and login with JWT authentication
- Password hashing with BCrypt
- Role-based authorization for product and category management
- User-specific shopping carts with quantity updates and item removal
- Demo checkout that creates an order and updates inventory
- Order history and individual order retrieval through the API
- Request validation, error handling, and automated backend tests
- Responsive storefront for browsing hardware products

**Note:** Checkout creates an order in the database; it does not process real payments. Some storefront navigation elements are presentation-only.

## Project structure

```text
frontend/                React and Vite storefront
src/main/java/           Spring Boot API, services, entities and repositories
src/main/resources/      Application configuration
src/test/java/           Backend tests
pom.xml                  Maven configuration
```

## Run locally

### Requirements

- JDK 21
- Node.js and npm compatible with Vite 8
- PostgreSQL
- A terminal (the Maven wrapper is included)

### 1. Set up the database

Create a local PostgreSQL database named `ecommerce`, or use an existing database and set its JDBC connection URL.

The backend reads these environment variables:

| Variable | Purpose |
| --- | --- |
| `DB_URL` | JDBC PostgreSQL URL (defaults to `jdbc:postgresql://localhost:5432/ecommerce`) |
| `DB_USERNAME` | Database username (defaults to `postgres`) |
| `DB_PASSWORD` | Database password (required) |
| `JWT_SECRET` | Base64-encoded secret for signing JWTs (required) |

Generate a strong random secret and keep it outside the repository. Never commit real credentials.

### 2. Start the backend

Set the environment variables in your terminal or IDE, then run:

**Windows:**
```cmd
mvnw.cmd spring-boot:run
```

**macOS / Linux:**
```bash
./mvnw spring-boot:run
```

The API runs on `http://localhost:8080` by default. Swagger UI is available at `http://localhost:8080/swagger-ui/index.html`.

### 3. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite serves the storefront locally, usually at `http://localhost:5173`.

By default, the frontend calls `http://localhost:8080/api`. Set `VITE_API_URL` to a different API base URL when needed. For example, a local `frontend/.env.local` file can contain:

```dotenv
VITE_API_URL=http://localhost:8080/api
```

### 4. Run tests

**Windows:**
```cmd
mvnw.cmd test
```

**macOS / Linux:**
```bash
./mvnw test
```

## API overview

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register an account |
| POST | `/api/auth/login` | Log in and receive a JWT |
| GET | `/api/products` | List products |
| GET | `/api/categories` | List categories |
| GET | `/api/cart` | View the authenticated user's cart |
| POST | `/api/cart` | Add an item |
| PUT | `/api/cart/{cartItemId}` | Update item quantity |
| DELETE | `/api/cart/{cartItemId}` | Remove an item |
| POST | `/api/orders/checkout` | Create a demo order |
| GET | `/api/orders` | View the authenticated user's orders |
| GET | `/api/orders/{orderId}` | View one of the user's orders |

Product and category write operations require the `ADMIN` role. Cart and order endpoints require authentication.

## Notes

This project is still evolving. Future improvements may include password recovery, stronger protection against automated requests, and database migrations for production deployments.

---

Built by Glennder Vallejo as a software development portfolio project.
