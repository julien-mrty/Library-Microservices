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

Run PostgreSQL in Docker
docker run --name postgres-dev -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=mydatabase -p 5432:5432 -d postgres

Connect to PostgreSQL Inside the Container
docker exec -it postgres-dev psql -U myuser -d mydatabase
