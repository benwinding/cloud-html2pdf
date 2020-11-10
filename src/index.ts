import { AddCors } from "./middleware";
import { Html2Pdf } from "./pdf-conversion";
import { Html2JpegBase64Thumb, PDFUrlToBase64Thumb } from './png-conversion';
import { ImgShrinkFromUrl } from "./img-shrink";

const path = require('path');
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
app.use(function (req: Request, res: any, next: () => void) {
  console.log('Time:', {url: req.url}, Date.now())
  next()
})

app.use('/', express.static(path.join(__dirname, '../public')))
app.use('/pdf/generate', Html2Pdf);
app.use('/pdf/base64thumb', PDFUrlToBase64Thumb);
app.use('/html/base64thumb', Html2JpegBase64Thumb);
app.use('/img/urlshrink', ImgShrinkFromUrl);

// viewed at http://localhost:8080
const server = app.listen(process.env.PORT || 8080, () => {
  const port = server.address().port;
  console.log(`App listening on port ${port}`);
});
server.setTimeout(7 * 60 * 1000);
