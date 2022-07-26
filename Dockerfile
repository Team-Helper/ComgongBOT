FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN apk add openjdk11
RUN npm install && npm install -g firebase-tools
COPY . .
CMD [ "npm", "start" ]