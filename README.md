# Aero Groundstation

[![Python](https://img.shields.io/badge/python-3.6.8-blue)](https://www.python.org/downloads/release/python-368/) [![Flask](https://img.shields.io/badge/flask-1.1.1-blue)](https://pypi.org/project/Flask/) [![redis](https://img.shields.io/badge/redis-5.0-blue)](https://redis.io/download) [![SQLite](https://img.shields.io/badge/SQLite-3.22.0-blue)](https://www.sqlite.org/releaselog/3_22_0.html)
[![Vue](https://img.shields.io/badge/vue-3.10.0-red)](https://www.npmjs.com/package/vue) [![npm](https://img.shields.io/badge/npm-6.9.0-red)](https://nodejs.org/en/download/current/) [![node](https://img.shields.io/badge/node-12.6.0-red)](https://nodejs.org/en/download/current/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Docker](https://img.shields.io/badge/Docker-2.1+-yellow.svg)](https://www.docker.com/)

Groundstation web application for Western University Aero Design Club

### Overview
The groundstation app uses docker to run containers containing the frontend and backend
__Frontend__
- Built on Alpine
- Contains Vue, nodejs

__Backend__
- Built on Ubuntu
- Contains flask, sqlite

__Cache__
- Built using Redis' official image

### Tech
* Vue - Used to run frontend
* node.js - Used for Vue
* flask - Used for backend
* SQLite - Handles database
* redis - Handles caching
* Flask-SQlAlchemy - Used to bridge flask and SQLAlchemy
* Flask-Migrate - Used for database migrations
* SQLAlchemy - Used for database access
* alembic - Used fo database migrations
* Flask-CORS - Used for cross origin resource sharing

### Installation

The groundstation app runs on docker containers and just needs docker 2.10+ to run. :whale:

Install Docker [here](https://www.docker.com/). You'll need to make an account and get an id if you don't already have one. Try and get the latest version possible and make sure docker compose is included. If using Windows, you will need Windows 10 Pro edition, follow [these](https://docs.docker.com/toolbox/toolbox_install_windows/) instructions if you don't.

When running docker, keep in mind that it requires Windows Hypervisor (unless you're using Docker toolbox) so you will need to activate it (requires restart).

Development is done through the docker containers and likely nothing else needs to be installed. Docker containers are headless so any GUI based tools will need to be installed on your host machine. The Docker compose file mounts your working directory for the groundstation app repository to the containers so you will be able to use tools that need direct access to files such as SQLiteBrowser.


### Development

Development is done on the files in your local repository and any IDE or editor can be used. To run the containers cd to the root of the project directory where the docker-compose.yaml file is

```sh
$ cd project/path
```

The docker containers are started by using docker-compose up
```sh
$ docker-compose up
```

Docker will build the containers if they haven't been built already. If the dockerfiles or docker-compose file are changed, a rebuild can be forced by using

```sh
$ docker-compose up --force-recreate --build
```

Hot-reloading is enabled on both the frontend and backend containers so all changes made to the source files should be reflected live.
If you want to access a running container and run commands within them, you can use docker exec.

```sh
$ docker exec -it [container_name] [entrypoint]
```
To access the shell on the backend use

```sh
$ docker exec -it [container_name] /bin/bash
```

The frontend container runs on Alpine so sh will not be available

```sh
$ docker exec -it [container_name] /bin/sh
```

The container name can be found using
```sh
$ docker ps
```

For development the containers can be accessed in browser at:
Frontend -> localhost:8080
Backend -> localhost:5000

Individual docker images can be found on dockerhub at the uwoaerodesign repository.