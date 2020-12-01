# Western Aero Design - Ground Station

[![NPM](https://img.shields.io/npm/v/npm)](hhttps://www.npmjs.com/) 

Ground station web application for Western University Aero Design Mega-Team

## Overview
The ground station runs vanilla HTML, CSS, and JS served from a Node.js backend.

### Getting Started

```sh
git clone https://github.com/UWO-Aero-Design/gnd-station.git
cd gnd-station
node api/server.js
```

The server will be live on [http://locahost:5000](http://locahost:5000).

### Development

[Nodemon](https://www.npmjs.com/package/nodemon) is a filewatch wrapper that makes developing Node applications easier. It will restart the server everytime a file is edited. This is included as a part of the dev dependencies in `api/package.json`.

```sh
git clone https://github.com/UWO-Aero-Design/gnd-station.git
cd gnd-station
nodemon api/server.js
```

The server will be live on [http://locahost:5000](http://locahost:5000). Try editing a file and watch Nodemon automatically restart the server.

### Documentation
The API documentation is available at the `/docs` endpoint.
