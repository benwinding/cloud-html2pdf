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
RUN npm install --only=production

COPY . .

# Begin xvfb server and start node script
CMD ['npm', 'start']
