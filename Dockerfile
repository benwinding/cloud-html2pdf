#### Original Base (not updated to latest chrome)
# FROM buildkite/puppeteer

#### Our edited base from (gets latest chrome)
FROM node:10.15.3-slim@sha256:88da5cd281ece24309c4e6fcce000a8001b17804e19f94a0439954568716a668
    
RUN  apt-get update \
     && apt-get install -y wget --no-install-recommends \
     && wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
     && apt-get install -y ./google-chrome-stable_current_amd64.deb --no-install-recommends

### Our Dockerfile coe

RUN apt-get update
RUN apt-get install -y \
  ghostscript

RUN npm --version
RUN node --version

# Create and change to the app directory.
WORKDIR /usr/src/app

# Ensure local changes don't trigger npm install "every" time
COPY ./package*.json ./
# Install production dependencies.
RUN npm install

# Copy and build project
COPY . .
Run npm run build

RUN which google-chrome
RUN google-chrome --version

CMD npm run start
