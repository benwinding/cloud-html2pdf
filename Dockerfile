#### Runtime Container
FROM buildkite/puppeteer

RUN apt-get update
RUN apt-get install -y \
  ghostscript

RUN npm --version
RUN node --version

# install app
RUN npm i -g yarn
COPY ./package.json ./package.json
RUN yarn --prod
COPY . .

# Begin xvfb server and start node script
CMD node lib/index.js
