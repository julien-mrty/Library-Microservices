```markdown
# Service-Oriented Architecture (SOA) – Library Microservices

A **Microservices Library System** built with Node.js, following a Service-Oriented Architecture (SOA). Each microservice handles a specific domain — for example, **Auth** for user authentication/authorization, and **Book** for managing library books. This design ensures clear separation of concerns and scalability.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Environment Files (.env)](#environment-files-env)
   - [Migrations](#migrations)
   - [Running with Docker Compose](#running-with-docker-compose)
   - [Alternative: Pulling Images from Docker Hub](#alternative-pulling-images-from-docker-hub)
5. [API Documentation](#api-documentation)
6. [Testing Endpoints](#testing-endpoints)
   - [Using Swagger UI](#using-swagger-ui)
   - [Using Postman](#using-postman)
7. [Pushing Your Own Images to Docker Hub](#pushing-your-own-images-to-docker-hub)
8. [Kubernetes Deployment](#kubernetes-deployment)
   - [Minikube Setup](#minikube-setup)
   - [Using the Deployment Scripts](#using-the-deployment-scripts)
9. [CI/CD](#cicd)
10. [Contributing](#contributing)
11. [License](#license)

---

## Overview

This **Library Management System** demonstrates a microservices approach:

- **Auth Service**: Manages user authentication (JWT-based) and authorization.
- **Book Service**: Manages book-related data and integrates with the Auth service.

The system is **containerized** with Docker and can be deployed with **Kubernetes**, making it scalable and portable.

---

## Tech Stack

- **Node.js** (>= v18)
- **Express**
- **PostgreSQL**
- **Docker** for containerization
- **Kubernetes** (Minikube) for local orchestration
- **Joi** (validation)
- **OpenAPI/Swagger** (API docs)
- **Prisma** (ORM for migrations)

---

## Features

1. **Separation of Concerns**: Auth and Book services run independently.
2. **JWT Authentication**: Secure login, register, and token validation.
3. **OpenAPI Docs**: Each microservice has its own Swagger UI for testing.
4. **Database**: PostgreSQL container, easily replaceable or scalable.
5. **Automated Migrations**: Via Prisma’s CLI.
6. **Kubernetes Deployment**: Provided scripts for Minikube environment.
7. **Automated CI/CD**: Streamlined development with GitHub Actions.

---

## Getting Started

### Prerequisites

- **Node.js** (v18+)
- **Docker** (Desktop or CLI)
- **PostgreSQL** (run via Docker)
- **Minikube** (if you want to deploy to Kubernetes locally)

### Installation

1. **Clone the repository**:
```bash
   git clone https://github.com/your-repo/service-oriented-architecture.git
   cd service-oriented-architecture
   ```

2. **Install dependencies for each service**:

```bash
   cd auth-service/
   npm install

   cd ../book-service/
   npm install

   cd ..
   ```

### Environment Files (.env)

Inside **auth-service** and **book-service**, you need two files: **.env.dev** and **.env.prod**. 

#### auth-service/.env.dev

```
DATABASE_URL=postgres://myuser:mypassword@postgres:5432/auth-db
PORT=5000
SECRET_KEY=your_secret_key
REFRESH_SECRET_KEY=your_refresh_secret
NODE_ENV=development
```

#### auth-service/.env.prod

```
PORT=3000
SECRET_KEY=your_secret_key
REFRESH_SECRET_KEY=your_refresh_secret
NODE_ENV=production
```

#### book-service/.env.dev

```
DATABASE_URL=postgres://myuser:mypassword@postgres:5432/book-db
PORT=5001
AUTH_SERVICE_URL=http://auth-service:5000/api/auth
NODE_ENV=development
SECRET_KEY=your_secret_key
REFRESH_SECRET_KEY=your_refresh_secret
```

#### book-service/.env.prod

```
PORT=3001
AUTH_SERVICE_URL=http://auth:3000/api/auth
NODE_ENV=production
```

### Migrations

1. **Install** `dotenv-cli` globally:
```bash
   npm install -g dotenv-cli
   ```

2. **Run Prisma migrations** for each service:
   ```bash
   # in auth-service/
   dotenv -e .env.dev -- npx prisma migrate dev --name init

   # in book-service/
   dotenv -e .env.dev -- npx prisma migrate dev --name init
   ```
   This applies initial database structure to your PostgreSQL.

### Running with Docker Compose

From the **root folder** (where `docker-compose.yml` is):

1. **Build and run**:
   ```bash
   docker compose build
   docker compose up
   ```

2. **Check logs**: You should see something like:
   ```
   All migrations have been successfully applied.
   auth-service  | Server is running on http://localhost:5000
   auth-service  | Swagger UI available at http://localhost:5000/api-docs
   book-service  | Book Service running on http://localhost:5001
   book-service  | Swagger UI available at http://localhost:5001/api-docs
   ```
3. **Verify** in Docker Desktop or `docker ps`.

4. **Visit**:
   - **Auth**: [http://localhost:5000](http://localhost:5000)
   - **Book**: [http://localhost:5001](http://localhost:5001)

### Alternative: Pulling Images from Docker Hub

If you prefer pre-built images (from user `77771603` on Docker Hub):

```bash
docker pull 77771603/auth-service
docker pull 77771603/book-service

# Run them locally
docker run -p 5000:5000 77771603/auth-service
docker run -p 5001:5001 77771603/book-service
```

---

## API Documentation

Each microservice has its own **Swagger UI**:

- **Auth Service**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- **Book Service**: [http://localhost:5001/api-docs](http://localhost:5001/api-docs)

Use the built-in **Try it out** feature to send requests.

---

## Testing Endpoints

### Using Swagger UI

- For **Auth Service** swagger: open [http://localhost:5000/api-docs](http://localhost:5000/api-docs).
  - **POST /register**, **POST /login**, etc.
  - You can click **Try it out**, enter the required JSON body, and see the response.

- For **Book Service** swagger: open [http://localhost:5001/api-docs](http://localhost:5001/api-docs).
  - **POST /books** with `{ "title": "some", "author": "someone", "year": 2025 }`.
  - JWT token (if required) can be set via the **Authorize** button (Bearer token).

### Using Postman

1. **Auth Service**:
   - **POST** `http://localhost:5000/api/auth/login`
   - In the Body → Raw → JSON:
     ```json
     { 
       "username": "test", 
       "password": "test"
     }
     ```
   - Copy the token in the response.

2. **Book Service**:
   - **GET** `http://localhost:5001/api/books`
   - Add a header:
     ```
     Authorization: Bearer <your JWT token here>
     ```
   - Send the request.

---


## Kubernetes Deployment

### Minikube Setup

1. Install **Minikube** if needed: [Minikube Installation Guide](https://minikube.sigs.k8s.io/docs/start/)
2. Install **kubectl**: [kubectl Installation Guide](https://kubernetes.io/docs/tasks/tools/)
3. Start Minikube:
```bash
   minikube start
   ```

### Using the Deployment Scripts

1. **deploy_postgres_to_minikube.ps1**
   - Deletes old PostgreSQL resources
   - Applies `postgres-configmap.yaml` and `postgres-deployment.yaml`
   - Run it in **PowerShell**:
     ```powershell
     ./deploy_postgres_to_minikube.ps1
     ```

2. **deploy_services_to_minikube.ps1**
   - Builds/pushes auth-service & book-service Docker images to your minikube environment
   - Applies `auth-service-deployment.yaml` and `book-service-deployment.yaml`
   - Then shows pods/services
   ```powershell
   ./deploy_services_to_minikube.ps1
   ```

3. **Check**:
   ```powershell
   kubectl get pods
   kubectl get svc
   minikube service list
   ```

4. **Test** with Postman or cURL:
   - For example: `http://127.0.0.1:<randomPort>/api/auth/login`

---

## CI/CD

You can integrate this with a CI/CD pipeline (e.g., **GitHub Actions**). Each microservice can have its own workflow for testing, building, and pushing to Docker Hub.

---

## Contributing

Contributions are welcome!  
1. **Fork** the repo  
2. **Create** a feature branch  
3. **Commit** & push your changes  
4. **Open** a pull request  

---

## License

This project is licensed under the [MIT License](LICENSE).

```