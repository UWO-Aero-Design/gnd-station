# Western Aero Design - Ground Station

[![Docker](https://img.shields.io/badge/Docker-v20.10.8-brightgreen)](https://www.docker.com/)

Ground station web application for Western University Aero Design Mega-Team

## Overview
The ground station runs a React frontend and a Node.js backend with a Mongo DB database. There is also an option OpenStreetMap container for serving map tiles to the map display.

### Getting Started

```sh
git clone https://github.com/UWO-Aero-Design/gnd-station.git
cp sample.env .env # copies environment variables, modify as necessary
docker compose up
```

The server will be live on [http://localhost:5000](http://localhost:5000).

~~Note: because of [an issue](https://github.com/protocolbuffers/protobuf/issues/3571#issuecomment-566437265) with Google's Protocol Buffers, a quick patch is automatically run via `npm run patch`, which turns on certain assertions to allow for nested messages.~~ [to be moved to USB driver tool]

The React server will be live on [http://localhost:3000](http://localhost:3000). To view logs from the frontend, backend, or database, instead of all three combined, open a new shell and use `docker compose logs <api|frontend|db> -f`. You can list multiple services to combine outputs (eg. `docker compose logs api frontend -f).

When done development, use `docker compose down` to clean everything up.

If required, the Nodejs server is at [http://localhost:5000](http://localhost:5000), and the WebSocket server is at [http://localhost:5001](http://localhost:5001). Note: any container-to-container networking should use the container name for communication (eg. React container accesses Nodejs server via http://api:5000, where the port is the internal port used by the container)

#### Database
In order to reset the database, bring the containers down with `docker-compose down`, delete the `db` folder and then restart the database with `docker-compose up`.

You can connect to the database with a visual GUI such as [Compass](https://www.mongodb.com/products/compass). The link is provided in the nodejs console upon successful connection and is of the form `mongodb://<username>:<password>@<hostname>:<port>` (the hostname will be "db" instead of "localhost"). You can also use [Postman](https://www.postman.com/) to simulate HTTP requests to the backend.

#### Map Tiles (temporarily removed)
Map tiles are provided by OpenStreetMap running in a Docker container. The rendered files are fairly large so you can use [BBBike](https://extract.bbbike.org/) to download smaller PBFs. You must first import the files into a docker volume and then render them for use by OSM. Note: you must use the absolute file location in the following commands (use `pwd` command to get your current directory). Ensure you are in the top level folder when executing the following commands.

```
docker volume create osm-data osm-rendered
docker run -v /absolute/path/to/london.pbf:/data.osm.pbf -v osm-data:/var/lib/postgresql/12/main overv/openstreetmap-tile-server import
docker-compose up
```

The imported files are stored in a docker volume called osm-data and the rendered files in a docker volume called osm-rendered. These will not be deleted when running `docker-compose down` so delete them when you're done using `docker volume rm osm-data osm-rendered`.

### Documentation
The API documentation is available at the [http://localhost:5000/docs](http://localhost:5000/docs)`/docs`.
