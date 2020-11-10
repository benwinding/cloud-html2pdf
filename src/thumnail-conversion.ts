import * as sharp from "sharp";
import { launchChromeInstance } from "./browser-helper";
import { generateTempJpegPath, generateTempPdfPath, tryRemoveFiles } from "./fs-helper";
import { savePdfUrlToDisk } from "./pdf-fetch";
import * as fs from "fs-extra";
import { saveThumbnailFromPdf } from "./pdf-helpers";

export async function resizeImageBuffer(imgBuffer: Buffer): Promise<Buffer> {
  const w = Math.round(210*1.5);
  const h = Math.round(297*1.5);
  const data = await sharp(imgBuffer)
    .resize(w, h)
    .toBuffer();
  return data;
}

export async function html2ImageBuffer(html: string, width: string, height: string) {
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

export async function pdfUrl2ImageBuffer(pdfUrl: string, width: number, height: number) {
  const tempPdfPath = generateTempPdfPath();
  const tempImagePath = generateTempJpegPath();
  try {
    await savePdfUrlToDisk(pdfUrl, tempPdfPath);
    await saveThumbnailFromPdf(tempPdfPath, tempImagePath, width, height);
    const imgBuffer = await fs.readFile(tempImagePath);
    return imgBuffer;
  } catch (error) {
    throw new Error(error);
  } finally {
    tryRemoveFiles(tempPdfPath, tempImagePath);
  }
}
