-- Create the auth-db database
CREATE DATABASE "auth-db";

-- Create a user for auth-db (optional)
CREATE USER auth_user WITH PASSWORD 'auth_password';
GRANT ALL PRIVILEGES ON DATABASE "auth-db" TO auth_user;

-- Create the book-db database
CREATE DATABASE "book-db";

-- Create a user for book-db (optional)
CREATE USER book_user WITH PASSWORD 'book_password';
GRANT ALL PRIVILEGES ON DATABASE "book-db" TO book_user;