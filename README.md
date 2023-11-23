# Alexis(Northcoders) News API

## Link to hosted API
https://alexis-news-server.onrender.com

## Project Summary
A news application featuring articles posted by members of our community, with topics (on live version) including coding, football and cooking!

## Instructions
### How to clone

To clone this repo locally, copy the repo URL from github and enter into your terminal using the command below: 

> git clone "insert repo URL" (without the quotation marks)

### Install dependencies

The following DEVELOPER DEPENDENCIES are required

- "husky": "^8.0.2",
- "jest": "^27.5.1",
- "jest-extended": "^2.0.0",
- "jest-sorted": "^1.0.14",
- "pg-format": "^1.0.4",
- "supertest": "^6.3.3"

To install each of these, enter the following in the terminal:

> npm install -D "insert name of the dependency" (without the quotation marks)

The following DEPENDENCIES are required for the app to run.

- "dotenv": "^16.0.0",
- "express": "^4.18.2",
- "pg": "^8.7.3",

To install each of these, enter the following in the terminal:

> npm install "insert name of the dependency" (without the quotation marks)

### Connecting locally to the databases

Create two .env files: .env.test and .env.development. Add PGDATABASE= into each, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored.

### Setup local databases

Before writing or running any code, you will first need to set up a local test and develop databases. You can do this with running the command below on your terminal.

> npm run setup-dbs


### Seending and testing
The seed function should run automatically when you run your tests. You can start testing with running the command below on your terminal.

> npm test app




### Version updates

Node.js version 18.12.1 & Postgres version 2.5.12 or later are required
