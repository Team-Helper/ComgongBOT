FROM node:lts-alpine
WORKDIR /app/functions
COPY package*.json ./
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
RUN apk add openjdk11 && npm install && npm install -g firebase-tools
COPY . .
EXPOSE 4000 5000 8080 9000 9099
CMD [ "npm", "start" ]