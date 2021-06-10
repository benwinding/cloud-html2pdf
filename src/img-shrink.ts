import { OptionRequestsAreOk, HasQuery } from "./middleware";
import { Request, Response } from "express";
import * as sharp from "sharp";
import axios from "axios";

export const ImgShrinkFromUrl = [
  OptionRequestsAreOk,
  HasQuery("url"),
  HasQuery("widthmax"),
  HandleImgShrinkFromUrl,
];

async function HandleImgShrinkFromUrl(req: Request, res: Response) {
  // Get html string from query
  const { url, widthmax } = req.query as any;
  try {
    console.log("img-shrink: reading image url");
    const imageBuffer = await imgUrl2ImageBuffer(url);
    console.log("img-shrink: resizing image");
    const imageBufferResized = await resizeImageBuffer(imageBuffer, +widthmax);
    console.log("img-shrink: converting done");
    res.status(200);
    res.contentType('image/jpeg');
    res.removeHeader('Access-Control-Allow-Headers')
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.send(imageBufferResized);
  } catch (e) {
    console.error("img-shrink: An Error occurred when processing img", {
      e,
    });
    res.status(500);
    res.send(e);
  }
}

async function resizeImageBuffer(
  imgBuffer: Buffer,
  widthmax: number
): Promise<Buffer> {
  const data = await sharp(imgBuffer)
    .resize({ width: widthmax, withoutEnlargement: false })
    .withMetadata()
    .jpeg()
    .toBuffer();
  return data;
}

async function imgUrl2ImageBuffer(imgUrl: string): Promise<Buffer> {
  try {
    const res = await axios.get(imgUrl, {
      responseType: "arraybuffer",
    });
    const data = Buffer.from(res.data, "binary");
    return data;
  } catch (error) {
    throw new Error(error);
  }
}
