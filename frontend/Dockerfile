FROM node:22

WORKDIR /dhbw360/app

COPY package.json ./
RUN npm install --omit=dev --force

CMD ["node", "dist/frontend/server/server.mjs"]
