#Base Image = Ubuntu 18.04 (Recommended Latest Version For Development)
FROM ubuntu:18.04

#Set working directory to app directory
WORKDIR /app

#Transfer working files to app directory in image
COPY /App /app

#Update ubuntu
RUN apt-get update

#Install pip
RUN apt-get -y install python3-pip

#Transfer requirements file to app
COPY requirements.txt /tmp

#Install packages
WORKDIR /tmp
RUN pip3 install --trusted-host pypi.python.org -r requirements.txt

#Set working directory back to app directory
WORKDIR /app

#Supress insecure HTTPS warning
RUN export PYTHONWARNINGS="ignore:Unverified HTTPS request"

#Open port 80
EXPOSE 80

#Run server on open
CMD ["python3", "app.py"]