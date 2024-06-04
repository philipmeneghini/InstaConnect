FROM node:latest
WORKDIR /app
COPY package.json package.json
COPY tsconfig.json tsconfig.json
RUN npm i --force
COPY . .
CMD ["npm", "start"]