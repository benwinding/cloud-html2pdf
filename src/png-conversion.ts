import {
  OptionRequestsAreOk,
  PostRequestsOnly,
  HasBodyProp
} from "./middleware";
import { Request, Response } from "express";
import * as sharp from "sharp";
import { launchChromeInstance } from "./browser-helper";

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

async function resizeImageBuffer(imgBuffer): Promise<Buffer> {
  const w = Math.round(210*1.5);
  const h = Math.round(297*1.5);
  const data = await sharp(imgBuffer)
    .resize(w, h)
    .toBuffer();
  return data;
}

async function html2ImageBuffer(html: string, width: string, height: string) {
  try {
    const browser = await launchChromeInstance();
    const page = await browser.newPage();
    await page.setViewport({
      width: Math.round(+width),
      height: Math.round(+height)
    });
    await page.setContent(html, { waitUntil: "networkidle2" });
    const buffer = await page.screenshot({ type: "jpeg", encoding: "binary" });
    await browser.close();
    return buffer;
  } catch (error) {
    throw new Error(error);
  }
}
