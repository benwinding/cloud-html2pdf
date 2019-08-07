import { Html2Pdf } from "./pdf-conversion";
import { AddCors } from "./middleware";
import { Html2JpegBase64Thumb } from './png-conversion';

const express = require('express');

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser({limit: '5mb'}));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.use(AddCors);
app.get('/', async (req, res) => {
  res.status(200).send('PDF CONVERTER RUNNING');
});
app.use('/pdf/generate', Html2Pdf);
app.use('/html/base64thumb', Html2JpegBase64Thumb);

const server = app.listen(process.env.PORT || 8080, () => {
  const port = server.address().port;
  console.log(`App listening on port ${port}`);
});
server.setTimeout(5 * 60 * 1000);
