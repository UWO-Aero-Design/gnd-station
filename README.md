# Western Aero Design - Ground Station

[![NPM](https://img.shields.io/npm/v/npm)](https://www.npmjs.com/)[![MongoDB](ttps://img.shields.io/badge/MongoDB-3.6-blue)](https://www.mongodb.com/)

Ground station web application for Western University Aero Design Mega-Team

## Overview
The ground station runs vanilla HTML, CSS, and JS served from a Node.js backend. The database must be a postgres instance.

### Getting Started

#### Backend

```sh
git clone https://github.com/UWO-Aero-Design/gnd-station.git
cd gnd-station
npm install
npm run patch
node api/server.js
```

The server will be live on [http://locahost:5000](http://locahost:5000). Note: because of [an issue](https://github.com/protocolbuffers/protobuf/issues/3571#issuecomment-566437265) with Google's Protocol Buffers, a quick patch via `npm run patch` is needed to turn certain assertions to allow for nest messages.

#### Database
The easiest method to get a database running is through the provided docker container (you will need [docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/) installed). Ensure you are in the top level folder when executing the following commands.
```sh
cp sample.env .env # copies environment variables
docker-compose up -d
```
Use `docker-compose down` to bring down the database. You can also use a local mongodb instance or even a cloud provider - just add the relevant credentials to the .env file. Note: using the docker-compose method will create an untracked `db` folder in the main directory. In order to reset the database, bring the container down with `docker-compose down`, delete the `db` folder and then restart the database with `docker-compose up`.

You can connect to the database with a visual GUI such as [Compass](https://www.mongodb.com/products/compass). The link is provided in the nodejs console upon successful connection and is of the form `mongodb://<username>:<password>@<hostname>:<port>`. You can also use [Postman](https://www.postman.com/) to simulate HTTP requests to the backend.

### Development

[Nodemon](https://www.npmjs.com/package/nodemon) is a filewatch wrapper that makes developing Node applications easier. It will restart the server everytime a file is edited. This is included as a part of the dev dependencies in `api/package.json`.

```sh
git clone https://github.com/UWO-Aero-Design/gnd-station.git
cd gnd-station
npm install
npm run patch
nodemon api/server.js
```

The server will be live on [http://locahost:5000](http://locahost:5000). Try editing a file and watch Nodemon automatically restart the server. Note: you will still need the database running - follow the instructions under Database.

### Documentation
The API documentation is available at the `/docs` endpoint.
