# WalletWise Backend

A complete production-ready backend project built with Node.js, Express, PostgreSQL, and Sequelize.

## Technology Stack
- Node.js & Express.js
- PostgreSQL & Sequelize ORM
- JWT Authentication & Bcrypt
- Nodemailer
- Multer
- Swagger API Docs

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start PostgreSQL via Docker:
   ```bash
   docker-compose up -d
   ```
3. Set up `.env` file based on `.env.example`
4. Start the server:
   ```bash
   npm run dev
   ```

## API Documentation
Swagger is available at: `http://localhost:5000/api-docs`

## Features
- Auth, Expense, Income, Budget, Dashboard, AI Insights, Transactions, Reports (PDF/Excel)
