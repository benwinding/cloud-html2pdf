#### Runtime Container
FROM buildkite/puppeteer

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

CMD npm run start
