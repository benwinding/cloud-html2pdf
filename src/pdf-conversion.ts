import {
  OptionRequestsAreOk,
  PostRequestsOnly,
  HasBodyProp
} from "./middleware";
import { Request, Response } from "express";
import { writeFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import uuidv1 = require("uuid/v1");
import * as fs from 'fs';

const Nightmare = require("nightmare");
const nightmare = Nightmare({ show: false });

export const Html2Pdf = [
  OptionRequestsAreOk,
  PostRequestsOnly,
  HasBodyProp("html"),
  HasBodyProp("filename"),
  HandleHtml2Pdf
];

async function HandleHtml2Pdf(req: Request, res: Response) {
  // Get html string from query
  const { html, filename } = req.body;

  try {
    console.log("pdf-generation: Begining pdf conversion");
    const tempHtmlPath = join(tmpdir(), uuidv1() + ".html");
    const tempPdfPath = join(tmpdir(), uuidv1() + ".pdf");
    writeFileSync(tempHtmlPath, html);
    console.log("pdf-generation: saving temp HtmlPath file: ", tempHtmlPath);

    pingDownloadBegin(res, filename);
    const ref = pingDownloadTimerStart(res);

    setTimeout(async () => {
      
    await nightmare.goto("file://" + tempHtmlPath).pdf(tempPdfPath);
    console.log("pdf-generation: saving temp PdfPath  file: ", tempPdfPath);

    pingDownloadTimerStop(ref);

    var filestream = fs.createReadStream(tempPdfPath);
    filestream.pipe(res);
    filestream.on('close', () => {
      console.log('pdf-generation: removing file: ' + tempHtmlPath);
      console.log('pdf-generation: removing file: ' + tempPdfPath);
      unlinkSync(tempHtmlPath);
      unlinkSync(tempPdfPath);
    })
  }, 5000);
} catch (e) {
    console.error("pdf-generation: An Error occurred when processing HTML", {
      e
    });
    res.status(500);
    res.send(e);
  }
}

function pingDownloadBegin(res: Response, downloadFileName: string) {
  res.writeHead(200, {
    "Content-Type": "application/octet-stream",
    "Content-Disposition": "attachment; filename=" + downloadFileName
  });
}
function pingDownloadTimerStart(res: Response): NodeJS.Timeout {
  const pinger = setInterval(() => {
    res.write('\n');
  }, 1000);
  return pinger;
}

function pingDownloadTimerStop(timeout: NodeJS.Timeout) {
  clearInterval(timeout);
}
