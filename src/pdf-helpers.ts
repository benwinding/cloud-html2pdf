const util = require("util");
const exec = util.promisify(require("child_process").exec);

export async function compressPdfFile(
  inputPdfPaths: string[],
  outputPdfFile: string,
  inputResolution: string | undefined
): Promise<void> {
  try {
    const inputImageRes = +(inputResolution + "");
    const imageResolution = Number.isFinite(inputImageRes)
      ? inputImageRes
      : 150;
    const inputPdfPathsJoined = inputPdfPaths.join(" ");
    const command = `gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook -dColorImageResolution=${imageResolution} -q -o ${outputPdfFile} ${inputPdfPathsJoined}`;
    await exec(command);
  } catch (error) {
    throw new Error(error);
  }
}

export async function saveThumbnailFromPdf(
  inputPdfPath: string,
  outputJpegPath: string,
  hPixels: number,
  wPixels: number
): Promise<void> {
  try {
    const command = `gs -sDEVICE=jpeg -dPDFFitPage=true -dDEVICEWIDTHPOINTS=${wPixels} -dDEVICEHEIGHTPOINTS=${hPixels} -q -o ${outputJpegPath} ${inputPdfPath}`;
    await exec(command);
  } catch (error) {
    throw new Error(error);
  }
}
