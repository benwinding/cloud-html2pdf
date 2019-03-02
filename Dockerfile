#### Builder Container
FROM rainabba/nodejs-8-wkhtmltopdf as builder
RUN which wkhtmltopdf

#### Runtime Container
FROM node:8.11.1
COPY --from=builder /usr/local/bin/wkhtmltopdf /bin/wkhtmltopdf
# confirm installation
RUN wkhtmltopdf --version
RUN npm --version
RUN node --version
# install app
RUN npm i -g yarn
COPY . .
RUN yarn --prod
CMD node lib/index.js
