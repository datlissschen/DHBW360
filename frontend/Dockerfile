FROM node:22

WORKDIR /dhbw360/app

COPY package.json ./
RUN npm install --omit=dev --force

RUN npm install -g http-server
CMD ["http-server", "dist/frontend/browser", "-p", "4000"]
