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

const Nightmare = require( 'nightmare');
const nightmare = Nightmare({ show: false })

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
    const tempHtmlPath = join(tmpdir(), uuidv1()+'.html');
    const tempPdfPath = join(tmpdir(), uuidv1()+'.pdf');
    writeFileSync(tempHtmlPath, html)
    console.log('pdf-generation: saving tempHtmlPath file: ', tempHtmlPath);

    await nightmare
      .goto('file://' + tempHtmlPath)
      .pdf(tempPdfPath);
    console.log('pdf-generation: saving tempPdfPath  file: ', tempPdfPath);

    res.download(tempPdfPath, filename, () => {
      console.log('pdf-generation: removing tempHtmlPath file: ', tempHtmlPath);
      console.log('pdf-generation: removing tempPdfPath  file: ', tempPdfPath);
      unlinkSync(tempHtmlPath);
      unlinkSync(tempPdfPath);
    });
  } catch (e) {
    console.error("pdf-generation: An Error occurred when processing HTML", {
      e
    });
    res.status(500);
    res.send(e);
  }
}
