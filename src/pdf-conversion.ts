import {
  OptionRequestsAreOk,
  PostRequestsOnly,
  HasBodyProp,
} from "./middleware";
import { Request, Response } from "express";
import { PdfRequest } from "./models";
import * as Pupeteer from 'puppeteer';
import { launchChromeInstance } from "./browser-helper";
import { addPdfsFromUrls } from "./pdf-fetch";
import { generateTempPdfPath, tryRemoveFile, tryRemoveFiles } from "./fs-helper";
const util = require("util");

export const Html2Pdf = [
  OptionRequestsAreOk,
  PostRequestsOnly,
  HasBodyProp("html"),
  HasBodyProp("filename"),
  HandleHtml2Pdf,
];

function GetConfig(b: PdfRequest): PdfRequest {
  return {
    html: b.html, 
    filename: b.filename || "converted.pdf", 
    imageResolution: b.imageResolution || "150", 
    noMargin: b.noMargin, 
    pdf_urls_prepend: b.pdf_urls_prepend, 
    pdf_urls_append: b.pdf_urls_append, 
    waitUntil: b.waitUntil || "networkidle0",
  }
}

async function HandleHtml2Pdf(req: Request, res: Response) {
  // Get html string from query
  const body = req.body as PdfRequest;
  const html = body.html;

  const config = GetConfig(body);

  let tempPdfPath = '';
  let tempPdfCompressedPath = '';
  let tempPdfsToJoinArray = [''];
  try {
    console.log("pdf-conversion: converting html to pdf", { options: config });
    tempPdfPath = generateTempPdfPath();
    await createPdf(html, tempPdfPath, config.noMargin, config.waitUntil);
    tempPdfCompressedPath = generateTempPdfPath();
    console.log("pdf-conversion: compressing pdf file", {
      tempPdfPath,
      tempPdfCompressedPath,
      imageResolution: config.imageResolution,
    });
    tempPdfsToJoinArray = await addPdfsFromUrls(tempPdfPath, config.pdf_urls_prepend, config.pdf_urls_append);
    await compressPdfFile(tempPdfsToJoinArray, tempPdfCompressedPath, config.imageResolution);
    console.log("pdf-conversion: sending compressed pdf file...", {
      tempPdfPath,
      tempPdfCompressedPath,
      imageResolution: config.imageResolution,
    });
    await new Promise((resolve, reject) =>
      res.download(tempPdfCompressedPath, config.filename, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    );
  } catch (e) {
    console.error("pdf-conversion: An Error occurred when processing HTML", {
      e,
    });
    res.status(500);
    res.send(e);
  }
  tryRemoveFile(tempPdfPath);
  tryRemoveFile(tempPdfCompressedPath);
  tryRemoveFiles(...tempPdfsToJoinArray);
}

async function compressPdfFile(
  inputPdfPaths: string[],
  outputPdfFile: string,
  inputResolution: string | undefined
): Promise<void> {
  try {
    const inputImageRes = +(inputResolution + '');
    const imageResolution = Number.isFinite(inputImageRes) ? inputImageRes : 150;
    const exec = util.promisify(require("child_process").exec);
    const inputPdfPathsJoined = inputPdfPaths.join(' ');
    const command = `gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook -dColorImageResolution=${imageResolution} -q -o ${outputPdfFile} ${inputPdfPathsJoined}`;
    await exec(command);
  } catch (error) {
    throw new Error(error);
  }
}

async function createPdf(
  html: string,
  outputPdfPath: string,
  noMargin: boolean | undefined,
  waitUntil: Pupeteer.LoadEvent | undefined
) {
  try {
    const browser = await launchChromeInstance();
    const version = await browser.version()
    console.log('createPdf using browser version: ' + version)
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: waitUntil });
    const footerFormat = 
    `
    <style type="text/css">
    .pdfheader {
      font-size: 10px;
      font-family: 'Raleway';
      font-weight: bold;
      width: 1000px;
      text-align: center;
      color: grey;
      padding-left: 10px;
    }
    </style>
    
    <div class="pdfheader">
      <span>Page </span>
      <span class="pageNumber"></span> / <span class="totalPages"></span>
    </div>
    `;
    const config: Pupeteer.PDFOptions = {
      printBackground: true,
      path: outputPdfPath,
      format: "A4",
      margin: {
        top: "10mm",
        bottom: "10mm",
        left: "10mm",
        right: "10mm",
      },
      displayHeaderFooter: true,
      headerTemplate : '<div></div>',
      footerTemplate:footerFormat,
    };
    if (noMargin) {
      config.margin = {
        top: "0mm",
        bottom: "0mm",
        left: "0mm",
        right: "0mm",
      };
    }
    await page.pdf(config);
    await browser.close();
  } catch (error) {
    throw new Error(error);
  }
}
