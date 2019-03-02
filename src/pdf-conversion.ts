import {
  OptionRequestsAreOk,
  PostRequestsOnly,
  HasBodyProp
} from "./middleware";
import { Request, Response } from "express";

// const convertHTMLToPDF = require("pdf-puppeteer");
import * as wkhtmltopdf from "wkhtmltopdf";
// import { wkhtmltopdf } from "./pdf-kit";
// import { wkhtmltopdf } from "@sugo/wkhtmltopdf";
import { Readable } from "stream";

export const Html2Pdf = [
  OptionRequestsAreOk,
  PostRequestsOnly,
  HasBodyProp("html"),
  HasBodyProp("filename"),
  HandleHtml2Pdf
];

// var wkhtmltopdf = require("wkhtmltopdf");
// If you don't have wkhtmltopdf in the PATH, then provide
// the path to the executable (in this case for windows would be):
// wkhtmltopdf.command = "/bin/wkhtmltopdf";

// wkhtmltopdf('http://ourcodeworld.com', { 
//     output: './ourcodeworld.pdf',
//     pageSize: 'letter'
// });

(async () => {
  wkhtmltopdf("http://www.google.com", {pageSize: 'A4'}, (err) => {
    console.log('done');
  });
})()


async function HandleHtml2Pdf(req: Request, res: Response) {
  // Get html string from query
  const { html, filename } = req.body;

  try {
    console.log("pdf-generation: Begining pdf conversion");
    // const childPipe: Readable = wkhtmltopdf(html);
    // const buffer = await wkhtmltopdfTask(html);
    const buffer = await wkhtmltopdf("http://www.google.com");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${filename}.pdf`
    );
    res.setHeader("Content-Length", buffer.byteLength);
    res.end(buffer);
  } catch (e) {
    console.error("pdf-generation: An Error occurred when processing HTML", {
      e
    });
    res.status(500);
    res.send(e);
  }
}

// async function wkhtmltopdfTask(html: string): Promise<Buffer> {
//   const command = `echo "${html}" | wkhtmltopdf - test.pdf`
// }
