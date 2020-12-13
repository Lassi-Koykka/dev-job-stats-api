FROM node:12
# Create app directory
WORKDIR /usr/src/dev-job-api

RUN apt-get update -y && apt-get install -y python3 python3-pip

COPY package*.json ./

COPY requirements.txt ./

RUN npm install

RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 8080


