import { tmpdir } from "os";
import { join } from "path";
import * as fs from "fs-extra";
import uuidv4 = require("uuid/v4");

export async function tryRemoveFile(filePath: string| undefined) {
  console.log("pdf-conversion: trying to remove file: ", filePath);
  if (!filePath) {
    return;
  }
  return fs.unlink(filePath).catch((e) => {
    // console.error('error removing file: ', e)
  });
}

export async function tryRemoveFiles(...filePaths: string[] ) {
  return Promise.all(filePaths.map(f => tryRemoveFile(f)));
}

export function generateTempPdfPath() { return join(tmpdir(), uuidv4() + ".pdf"); }
