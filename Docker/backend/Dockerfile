#Base Image = Ubuntu 18.04 (Recommended Latest Version For Development)
FROM ubuntu:18.04

#Update ubuntu
RUN apt-get update

#Install pip
RUN apt-get -y install python3-pip

#Transfer requirements file to app
COPY requirements.txt /tmp

#Install packages
WORKDIR /tmp
RUN pip3 install --trusted-host pypi.python.org --trusted-host files.pythonhosted.org -r requirements.txt

#Supress insecure HTTPS warning
RUN export PYTHONWARNINGS="ignore:Unverified HTTPS request"

#Install SQLite3
RUN apt-get update && apt-get -y install sqlite3

#Set working directory back to app directory
WORKDIR /app

#Transfer working files to app directory in image
COPY . /app

#Set flask environment variables
ENV FLASK_APP groundstation.py
ENV FLASK_RUN_HOST 0.0.0.0
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8

#Run server on open
#CMD ["flask", "run"]
CMD ["python3","groundstation.py"]