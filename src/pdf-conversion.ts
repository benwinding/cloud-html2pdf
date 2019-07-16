import {
  OptionRequestsAreOk,
  PostRequestsOnly,
  HasBodyProp
} from './middleware';
import { Request, Response } from 'express';
import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import uuidv1 = require('uuid/v1');
const util = require('util');
import * as fs from 'fs';
const writeFilePromise = util.promisify(fs.writeFile);
const rmFilePromise = util.promisify(fs.unlink);

export const Html2Pdf = [
  OptionRequestsAreOk,
  PostRequestsOnly,
  HasBodyProp('html'),
  HasBodyProp('filename'),
  HandleHtml2Pdf
];

function tryRemoveFile(filePath) {
  console.log('pdf-generation: trying to remove file: ', filePath);
  rmFilePromise(filePath).catch(e => {
    // console.error('error removing file: ', e)
  })
}

async function HandleHtml2Pdf(req: Request, res: Response) {
  // Get html string from query
  const { html, filename, imageResolution } = req.body;

  try {
    const Nightmare = require('nightmare');
    const nightmare = Nightmare({ show: false });
    console.log('pdf-generation: Begining pdf conversion');
    const tempHtmlPath = join(tmpdir(), uuidv1() + '.html');
    await writeFilePromise(tempHtmlPath, html);
    console.log('pdf-generation: saving tempHtmlPath file: ', tempHtmlPath);

    const tempPdfPath = join(tmpdir(), uuidv1() + '.pdf');
    await nightmare.goto('file://' + tempHtmlPath).pdf(tempPdfPath);
    const tempPdfCompressedPath = join(tmpdir(), uuidv1() + '.pdf');
    await compressPdfFile(tempPdfPath, tempPdfCompressedPath, imageResolution);
    console.log('pdf-generation: saving tempPdfPath  file: ', tempPdfPath);
    res.download(tempPdfCompressedPath, filename, async (err) => {
      if (err) {
        console.error('pdf-generation: error sending file:', err);
        res.status(500);
        res.send('pdf-generation: res.download() error sending file');
      }
      tryRemoveFile(tempHtmlPath);
      tryRemoveFile(tempPdfPath);
      tryRemoveFile(tempPdfCompressedPath);
    });
    // Ensure files are definitely removed after 4 minutes
    const timeOut = 4 * 60 * 1000;
    setTimeout(() => {
      tryRemoveFile(tempHtmlPath);
      tryRemoveFile(tempPdfPath);
      tryRemoveFile(tempPdfCompressedPath);
    }, timeOut);
  } catch (e) {
    console.error('pdf-generation: An Error occurred when processing HTML', {
      e
    });
    res.status(500);
    res.send(e);
  }
}

async function compressPdfFile(
  inputPdfPath: string,
  outputPdfFile: string,
  inputResolution: string
): Promise<void> {
  const imageResolution = +inputResolution || 150;
  const exec = util.promisify(require('child_process').exec);
  const command = `gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook -dColorImageResolution=${imageResolution} -q -o ${outputPdfFile} ${inputPdfPath}`;
  await exec(command);
}
