#Base Image = Ubuntu 18.04 (Recommended Latest Version For Development)
FROM ubuntu:18.04

#Update ubuntu
RUN apt-get update

#Install pip
RUN apt-get -y install python3-pip

#Transfer requirements file to app
COPY ../Docker/backend/requirements.txt /tmp

#Install packages
WORKDIR /tmp
RUN pip3 install --trusted-host pypi.python.org -r requirements.txt

#Supress insecure HTTPS warning
RUN export PYTHONWARNINGS="ignore:Unverified HTTPS request"

#Set working directory back to app directory
WORKDIR /app

#Transfer working files to app directory in image
COPY . /app

#Set flask environment variables
ENV FLASK_APP app.py
ENV FLASK_RUN_HOST 0.0.0.0
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8

#Run server on open
CMD ["flask", "run"]