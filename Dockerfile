FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./
COPY dist/ ./dist/

EXPOSE 8080

CMD [ "npm", "start" ]