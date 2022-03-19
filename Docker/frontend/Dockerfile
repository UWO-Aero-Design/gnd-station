#Base Image = Ubuntu 18.04 (Recommended Latest Version For Development)
FROM node:12.6.0-alpine

#Set working directory
WORKDIR /app

#Environment variables
ENV PATH /app/node_modules/.bin:$PATH

#Copy package.json and package-lock.json
COPY package*.json ./

#Install Vue cli
RUN npm install

#Copy project files
COPY . .

EXPOSE 8080

#Hot-reloading for Vue
ENV CHOKIDAR_USEPOLLING true

#Start Vue app
CMD ["npm", "run", "dev"]