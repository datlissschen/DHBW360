FROM node:22

WORKDIR /dhbw360/app

COPY package.json ./
RUN npm install --omit=dev

CMD ["node", "dist/index.js"]
