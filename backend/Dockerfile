FROM node:18-buster

WORKDIR ~/app/dev/becampana

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 4005

CMD ["npm", "start"]