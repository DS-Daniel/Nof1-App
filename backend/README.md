<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

N-of-1 tool backend API. Build with:
- [NestJS](https://github.com/nestjs/nest) framework
- [Mongoose](https://mongoosejs.com/)
- [Passeport](https://www.passportjs.org/)
- [Nodemailer](https://nodemailer.com/about/)
- [TypeScript](https://www.typescriptlang.org/)

## Prerequisites

Please make sure that Node.js (version >= 12) is installed on your operating system.

Create a `.env` file if not present and configure the following environment variables :

```bash
# APP PORT
PORT=3000 # port number of your choice
# Frontend url
FRONTEND_URL=http://your_frontend_application_url
# mongodb connection
MONGODB_URI=mongodb://localhost:27017/collection # your mongodb URI
# jwt
JWT_SECRET=YOUR_STRONG_JWT_SECRET # your jwt secret
JWT_EXPIRATION_TIME=24h # JWT expiration time of your choice
# Configuration of the email account that will be used to send emails to the pharmacy. 
MAIL_HOST=smtp.office365.com # smtp server address. Here is an exemple with a Microsoft account.
MAIL_USER=address@domain.com # email address
MAIL_PASSWORD=YOUR_PASSWORD # email account password
```

## Installation

```bash
$ npm install
```

## Running the app

> Make sure MongoDB is up and running before running the app.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run build
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```

## OpenAPI documentation

After running the app, you can access the OpenAPI documentation at http://localhost:PORT/api.
