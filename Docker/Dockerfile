FROM node:13.6.0
WORKDIR /app
RUN npm i pm2 -g
COPY package.json /app
RUN npm install
COPY . /app
ENV MONGO_HOST=localhost
CMD ["node", "bin/www"]