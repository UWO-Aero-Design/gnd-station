# Western Aero Design - Ground Station

[![NPM](https://img.shields.io/npm/v/npm)](https://www.npmjs.com/)[https://img.shields.io/badge/Postgres-13.1-blue](https://www.postgresql.org/)

Ground station web application for Western University Aero Design Mega-Team

## Overview
The ground station runs vanilla HTML, CSS, and JS served from a Node.js backend. The database must be a postgres instance.

### Getting Started

#### Backend

```sh
git clone https://github.com/UWO-Aero-Design/gnd-station.git
cd gnd-station
npm install
node api/server.js
```

#### Database
The easiest method to get a database running is through the provided docker container (you will need [docker-compose](https://docs.docker.com/compose/install/) installed).
```sh
cp sample.env .env # copies environment variables
docker-compose up -d
```
Use `docker-compose down` to bring down the database. You can also use a local postgres instance or even a cloud provider - just add the relevant credentials to the .env file.

The server will be live on [http://locahost:5000](http://locahost:5000).

### Development

[Nodemon](https://www.npmjs.com/package/nodemon) is a filewatch wrapper that makes developing Node applications easier. It will restart the server everytime a file is edited. This is included as a part of the dev dependencies in `api/package.json`.

```sh
git clone https://github.com/UWO-Aero-Design/gnd-station.git
cd gnd-station
npm install
nodemon api/server.js
```

The server will be live on [http://locahost:5000](http://locahost:5000). Try editing a file and watch Nodemon automatically restart the server. Note: you will still need the postgres database running - follow the instructions under Database.

### Documentation
The API documentation is available at the `/docs` endpoint.
