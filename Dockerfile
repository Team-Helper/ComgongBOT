FROM node:lts-alpine
WORKDIR /app/functions
COPY package*.json ./
RUN apk add openjdk11
RUN npm install && npm install -g firebase-tools
COPY . .
EXPOSE 4000 5000 8080 9000 9099
CMD [ "npm", "start" ]