import * as fs from "fs-extra";
import axios from "axios";
import { generateTempPdfPath } from "./fs-helper";

export async function addPdfsFromUrls(
  tempPdfPath: string,
  pdf_urls_prepend: string[] | undefined,
  pdf_urls_append: string[] | undefined
): Promise<string[]> {
  const pdfPathsToPrepend = await getPdfFilePaths(pdf_urls_prepend);
  const pdfPathsToAppend = await getPdfFilePaths(pdf_urls_append);
  const nothingToJoin = !pdfPathsToPrepend.length && !pdfPathsToPrepend.length;
  if (nothingToJoin) {
    return [tempPdfPath];
  }
  return [...pdfPathsToPrepend, tempPdfPath, ...pdfPathsToAppend];
}

async function getPdfFilePaths(pdfUrls: string[] | undefined): Promise<string[]> {
  if (!Array.isArray(pdfUrls) || !pdfUrls.length) {
    return [];
  }
  const pdfFilePaths = await Promise.all(
    pdfUrls.map(async (pdfUrl) => {
      const saveToPath = generateTempPdfPath();
      try {
        await savePdfUrlToDisk(pdfUrl, saveToPath)        
        return saveToPath;
      } catch (error) {
        console.error(error);
      }
      return '';
    })
  );
  return pdfFilePaths.filter(f => !!f);
}

export async function savePdfUrlToDisk(pdfUrl: string, saveToPath: string): Promise<void> {
  const response = await axios({
    method: "get",
    url: pdfUrl,
    responseType: "stream"
  })
  const stream = response.data as fs.ReadStream;
  stream.pipe(fs.createWriteStream(saveToPath));
  await new Promise(res => stream.on("close", () => res()));
  console.log('saved file to: ' + saveToPath);
}
