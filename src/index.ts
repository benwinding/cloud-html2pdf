import { Html2Pdf } from "./pdf-conversion";
import { AddCors } from "./middleware";

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
  res.status(200).send('Hello, world!\n');
});
app.use('/html2pdf', Html2Pdf);

const server = app.listen(process.env.PORT || 8080, () => {
  const port = server.address().port;
  console.log(`App listening on port ${port}`);
});
