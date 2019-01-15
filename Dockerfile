FROM 'node:8.15.0-jessie'
RUN apt-get update
RUN apt-get install -y tar git
RUN npm i -g yarn
COPY . .
RUN yarn --production=true

CMD node lib/index.js
