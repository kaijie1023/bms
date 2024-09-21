# Book Management System

## Installation
Make sure you have **Node.js >= 20.6** installed.
```bash
npm install
```

## Setup .env
```bash
cp .env.example .env
```
You may modify the `.env` file to fit your needs.

## Docker
MySql and Redis is managed by [Docker](https://www.docker.com/).
Run the following command to start the containers.
```bash
docker compose up -d
```


## Migration
Run the migrations to create the tables in the database.
```bash
node ace migration:run
```

## Seeding
Run the following command to seed the database.
```bash
node ace db:seed
```

## Start dev server
```bash
npm run dev
```

## Test
```bash
npm run test
```

## Lint
```bash
npm run lint
```

## Postman Collection
You can import the `BMS.postman_collection.json` file to Postman to test the API.