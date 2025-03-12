# Service-oriented-architecture

Microservices Library System
A Service-Oriented Architecture (SOA) project for managing a library, built with Node.js and powered by microservices. Each service handles a specific domain:

Authentication Service – Manages user authentication and authorization
Movie Service – Handles movie-related data
Book Service – Manages book-related information
Tech Stack
Node.js – Backend framework
PostgreSQL – Centralized database for all services
Joi – Schema validation for robust data integrity
OpenAPI – API documentation for seamless integration
Docker & Kubernetes – Containerization & orchestration for scalable deployment
GitHub Actions – CI/CD automation for streamlined development

Features
Microservices architecture with clear separation of concerns
Secure authentication and role-based access control
Fully documented APIs using OpenAPI
Robust validation with Joi framework
Scalable deployment with Docker & Kubernetes
Automated CI/CD pipeline via GitHub Actions

Initialize a New Node.js Project
npm init -y

Most Node.js apps use a web framework like Express to handle HTTP requests. Install it with:
npm install express

To download all the dependencies listed in your package.json file, run the following command:
npm install

To start your Node.js application, run:
node server.js

You should see:
Server is running on http://localhost:3000

Add Nodemon for Auto-Restart
To avoid restarting the server manually, install nodemon:

npm install -g nodemon

Run the server with:
nodemon server.js

## Linter

Install Prettier
npm install --save-dev prettier

### Enforce Prettier Before Commit

To automatically format code before committing, install Husky:

npm install --save-dev husky
npx husky init

Then, add a pre-commit hook:
npx husky add .husky/pre-commit "npx prettier --write ."
git config core.hooksPath .husky

Now, Prettier will automatically format your code before every commit.

# To run the PostgreSQL database :

Run PostgreSQL in Docker :
docker run --name postgres-dev -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=mydatabase -p 5432:5432 -d postgres

Start an already existing container :
docker start postgres-dev

Connect to PostgreSQL Inside the Container
docker exec -it postgres-dev psql -U myuser -d mydatabase

While in developement mode, set the env variable to developement :
Windows powershell : $env:NODE_ENV="developement"

To do the migrations locally, first install dotenv-cli :
npm install -g dotenv-cli

Then run the migration with the appropriate .env file :
dotenv -e .env.dev -- npx prisma migrate dev --name init



# Service-Oriented Architecture (SOA) - Library System

A **Microservices Library System** built with Node.js, leveraging a Service-Oriented Architecture (SOA). Each microservice handles a specific domain, ensuring clear separation of concerns and scalability.

---

## Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Running the Application](#running-the-application)
5. [Database Setup](#database-setup)
   - [Running PostgreSQL in Docker](#running-postgresql-in-docker)
   - [Connecting to PostgreSQL](#connecting-to-postgresql)
6. [Migrations](#migrations)
7. [Linting and Formatting](#linting-and-formatting)
8. [Deployment](#deployment)
   - [Docker](#docker)
   - [Kubernetes](#kubernetes)
9. [CI/CD with GitHub Actions](#cicd-with-github-actions)
10. [API Documentation](#api-documentation)
11. [Contributing](#contributing)
12. [License](#license)

---

## Overview
This project is a **Library Management System** built using a microservices architecture. Each service is responsible for a specific domain:
- **Authentication Service**: Manages user authentication and authorization.
- **Book Service**: Handles book-related data.
- **Movie Service**: Manages movie-related information.

The system is designed to be **scalable**, **secure**, and **easy to maintain**.

---

## Tech Stack
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Validation**: Joi
- **API Documentation**: OpenAPI (Swagger)
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions

---

## Features
- **Microservices Architecture**: Clear separation of concerns with independent services.
- **Secure Authentication**: JWT-based authentication and role-based access control.
- **API Documentation**: Fully documented APIs using OpenAPI.
- **Validation**: Robust schema validation with Joi.
- **Scalable Deployment**: Containerized with Docker and orchestrated with Kubernetes.
- **Automated CI/CD**: Streamlined development with GitHub Actions.

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Docker
- Kubernetes (Minikube for local development)
- PostgreSQL

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/service-oriented-architecture.git
   cd service-oriented-architecture
   ```
2. Install dependencies for all services:
   ```bash
   npm install
   ```

### Running the Application
Start the services:
```bash
npm start
```

Access the services:
- **Auth Service**: `http://localhost:3000`
- **Book Service**: `http://localhost:3001`
- **Movie Service**: `http://localhost:3002`

---

## Database Setup

### Running PostgreSQL in Docker
Start a PostgreSQL container:
```bash
docker run --name postgres-dev -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=mydatabase -p 5432:5432 -d postgres
```

Start an existing container:
```bash
docker start postgres-dev
```

### Connecting to PostgreSQL
Connect to the PostgreSQL container:
```bash
docker exec -it postgres-dev psql -U myuser -d mydatabase
```

---

## Migrations
To apply database migrations:

1. Install `dotenv-cli`:
   ```bash
   npm install -g dotenv-cli
   ```
2. Run migrations for development:
   ```bash
   dotenv -e .env.dev -- npx prisma migrate dev --name init
   ```

---

## Linting and Formatting
This project uses Prettier for code formatting and Husky for pre-commit hooks.

Install Prettier:
```bash
npm install --save-dev prettier
```

Set up Husky:
```bash
npm install --save-dev husky
npx husky init
npx husky add .husky/pre-commit "npx prettier --write ."
git config core.hooksPath .husky
```

---

## Deployment

### Docker
Build the Docker images:
```bash
docker build -t auth-service:latest ./auth-service/
docker build -t book-service:latest ./book-service/
docker build -t movie-service:latest ./movie-service/
```

Run the containers:
```bash
docker-compose up
```

### Kubernetes
Start Minikube:
```bash
minikube start
```

Deploy the services:
```bash
kubectl apply -f kubernetes/
```

Access the services:
```bash
minikube service auth-service
minikube service book-service
minikube service movie-service
```

---

## CI/CD with GitHub Actions
This project uses **GitHub Actions** for automated testing and deployment. Workflows are defined in `.github/workflows/`.

---

## API Documentation
API documentation is generated using OpenAPI (Swagger). Access the Swagger UI at:
- **Auth Service**: `http://localhost:3000/api-docs`
- **Book Service**: `http://localhost:3001/api-docs`
- **Movie Service**: `http://localhost:3002/api-docs`

---

## Contributing
Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add some feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a pull request.

---

## License
This project is licensed under the [MIT License](LICENSE).

