import {
  OptionRequestsAreOk,
  PostRequestsOnly,
  HasBodyProp
} from "./middleware";
import { Request, Response } from "express";
import { html2ImageBuffer, pdfUrl2ImageBuffer, resizeImageBuffer } from "./thumnail-conversion";

export const Html2JpegBase64Thumb = [
  OptionRequestsAreOk,
  PostRequestsOnly,
  HasBodyProp("html"),
  HandleHtml2JpegBase64
];

async function HandleHtml2JpegBase64(req: Request, res: Response) {
  // Get html string from query
  const { html } = req.body;
  try {
    console.log("png-generation: converting html to image");
    const w = (210 * 4).toString();
    const h = (297 * 4).toString();
    const imageBuffer = await html2ImageBuffer(html, w, h);
    console.log("png-generation: converting resizing image");
    const imageBufferResized = await resizeImageBuffer(imageBuffer);
    const imageBase64 = Buffer.from(imageBufferResized).toString("base64");
    console.log("png-generation: converting done");
    res.status(200);
    res.send(imageBase64);
  } catch (e) {
    console.error("png-generation: An Error occurred when processing HTML", {
      e
    });
    res.status(500);
    res.send(e);
  }
}

export const PDFUrlToBase64Thumb = [
  OptionRequestsAreOk,
  PostRequestsOnly,
  HasBodyProp("pdfUrl"),
  HandlePdfUrl2JpegBase64
]

async function HandlePdfUrl2JpegBase64(req: Request, res: Response) {
  const body = req.body;
  const pdfUrl = body.pdfUrl;
  console.log("png-generation: converting html to image");
  const w = (210 * 4);
  const h = (297 * 4);
  const imageBuffer = await pdfUrl2ImageBuffer(pdfUrl, w, h);
  console.log("png-generation: converting resizing image");
  const imageBufferResized = await resizeImageBuffer(imageBuffer);
  const imageBase64 = Buffer.from(imageBufferResized).toString("base64");
  console.log("png-generation: converting done");
  res.status(200);
  res.send(imageBase64);
}


