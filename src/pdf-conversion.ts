import { AddCors } from './middleware';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as pdf from 'html-pdf';
const uuidv1 = require('uuid/v1');

export const Html2Pdf = async (
  req: Request,
  res: Response
) => {
  // Add cors
  await AddCors(req, res);
  // Handle request types
  if (req.method === 'OPTIONS') {
    res.status(200).send('Option Requests are OK');
    return;
  }
  if (req.method !== 'POST') {
    console.warn('Only POST requests are supported');
    res.status(400).send('Only POST requests are supported');
    return;
  }

  // Get html string from query
  const htmlString = req.body['html'];
  const pdfDownloadName = req.body['filename']; // file.pdf

  try {
    console.log('pdf-generation: Begining pdf conversion');
    const outputPdfPath = await GeneratePdf(htmlString);
    // const outputPdf = tmpPdfObj.name;
    console.log('pdf-generation: done... outputPdf: ' + outputPdfPath);
    res.download(outputPdfPath, pdfDownloadName);
    res.on('finish', () => {
      fs.unlinkSync(outputPdfPath);
    });
  } catch (e) {
    console.error('pdf-generation: An Error occurred when processing HTML', {
      e
    });
    res.status(500);
    res.send(e);
  }
};

export async function GeneratePdf(htmlString: string): Promise<string> {
  const tmpPdfPath = '/tmp/' + uuidv1() + '.pdf';
  const options: pdf.CreateOptions = {
    format: 'A4',
    type: 'pdf',
    zoomFactor: '0.25',
    quality: '0.7'
  };

  console.log('begining pdf conversion');
  return new Promise((resolve, reject) => {
    pdf.create(htmlString, options).toFile(tmpPdfPath, function(err, res) {
      if (err) {
        reject(err);
        console.error(err);
      } else {
        console.log(res); // { filename: '/app/businesscard.pdf' }
        resolve(tmpPdfPath);
      }
    });
  });
}
