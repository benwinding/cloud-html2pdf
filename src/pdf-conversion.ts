import {
  OptionRequestsAreOk,
  PostRequestsOnly,
  HasBodyProp
} from "./middleware";
import { Request, Response } from "express";
import { tmpdir } from "os";
import { join } from "path";
import uuidv1 = require("uuid/v1");
const util = require("util");
import * as fs from "fs";
import { PdfRequest } from "./models";
const rmFilePromise = util.promisify(fs.unlink);

export const Html2Pdf = [
  OptionRequestsAreOk,
  PostRequestsOnly,
  HasBodyProp("html"),
  HasBodyProp("filename"),
  HandleHtml2Pdf
];

function tryRemoveFile(filePath) {
  console.log("pdf-generation: trying to remove file: ", filePath);
  rmFilePromise(filePath).catch(e => {
    // console.error('error removing file: ', e)
  });
}

async function HandleHtml2Pdf(req: Request, res: Response) {
  // Get html string from query
  const { html, filename, imageResolution, noMargin } = req.body as PdfRequest;

  let tempPdfPath: string, tempPdfCompressedPath: string;
  try {
    console.log("pdf-generation: converting html to pdf");
    tempPdfPath = join(tmpdir(), uuidv1() + ".pdf");
    await createPdf(html, tempPdfPath, noMargin);
    tempPdfCompressedPath = join(tmpdir(), uuidv1() + ".pdf");
    console.log("pdf-generation: compressing pdf file", {
      tempPdfPath,
      tempPdfCompressedPath,
      imageResolution
    });
    await compressPdfFile(tempPdfPath, tempPdfCompressedPath, imageResolution);
    console.log("pdf-generation: sending compressed pdf file...", {
      tempPdfPath,
      tempPdfCompressedPath,
      imageResolution
    });
    await new Promise((resolve, reject) =>
      res.download(tempPdfCompressedPath, filename, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    );
  } catch (e) {
    console.error("pdf-generation: An Error occurred when processing HTML", {
      e
    });
    res.status(500);
    res.send(e);
  }
  tryRemoveFile(tempPdfPath);
  tryRemoveFile(tempPdfCompressedPath);
}

async function compressPdfFile(
  inputPdfPath: string,
  outputPdfFile: string,
  inputResolution: string
): Promise<void> {
  try {
    const imageResolution = +inputResolution || 150;
    const exec = util.promisify(require("child_process").exec);
    const command = `gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook -dColorImageResolution=${imageResolution} -q -o ${outputPdfFile} ${inputPdfPath}`;
    await exec(command);
  } catch (error) {
    throw new Error(error);
  }
}

async function createPdf(html: string, outputPdfPath: string, noMargin: boolean) {
  try {
    const puppeteer = require("puppeteer");
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage"
      ]
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle2" });
    const config = {
      path: outputPdfPath,
      format: "A4",
      margin: {
        top: "10mm",
        bottom: "10mm",
        left: "10mm",
        right: "10mm"
      }
    };
    if (noMargin) {
      config.margin = {
        top: "0mm",
        bottom: "0mm",
        left: "0mm",
        right: "0mm"
      }
    }
    await page.pdf(config);
    await browser.close();
  } catch (error) {
    throw new Error(error);
  }
}
