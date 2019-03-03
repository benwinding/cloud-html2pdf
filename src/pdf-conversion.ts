import {
  OptionRequestsAreOk,
  PostRequestsOnly,
  HasBodyProp
} from "./middleware";
import { Request, Response } from "express";

import { wkhtmltopdf } from "@sugo/wkhtmltopdf";

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
    const buffer = await wkhtmltopdf(html);
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
