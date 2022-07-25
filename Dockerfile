FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install && npm install -g firebase-tools
COPY . .
CMD [ "npm", "start" ]