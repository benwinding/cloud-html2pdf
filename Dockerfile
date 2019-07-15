#### Runtime Container
FROM node:8.15.1-jessie
MAINTAINER Ivan Vanderbyl <ivan@flood.io>

RUN apt-get update

# Installing the packages needed to run Nightmare
RUN apt-get install -y \
  xvfb \
  x11-xkb-utils \
  xfonts-100dpi \
  xfonts-75dpi \
  xfonts-scalable \
  xfonts-cyrillic \
  x11-apps \
  clang \
  libdbus-1-dev \
  libgtk2.0-dev \
  libnotify-dev \
  libgnome-keyring-dev \
  libgconf2-dev \
  libasound2-dev \
  libcap-dev \
  libcups2-dev \
  libxtst-dev \
  libxss1 \
  libnss3-dev \
  gcc-multilib \
  g++-multilib

RUN npm --version
RUN node --version

# Start Xvfb
ENV DISPLAY=:9.0
ENV DEBUG=nightmare

# install app
RUN npm i -g yarn
COPY ./package.json ./package.json
RUN yarn --prod
COPY . .

# Begin xvfb server and start node script
CMD Xvfb -ac -screen scrn 1280x2000x24 :9.0 & node lib/index.js
