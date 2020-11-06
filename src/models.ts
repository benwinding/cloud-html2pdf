export interface PdfRequest {
  html: string;
  filename: string;
  imageResolution?: string;
  noMargin?: boolean;
  pdf_urls_prepend?: string[];
  pdf_urls_append?: string[];
  // Options from: https://github.com/puppeteer/puppeteer/blob/v3.0.0/docs/api.md#pagesetcontenthtml-options
  waitUntil?: "networkidle0" | "networkidle2" | "load" | "domcontentloaded";
}

const a = {
  html: "<h1>HELLO WORLD</h1>",
  filename: "doc.html",
  pdf_urls_prepend: [
    "https://firebasestorage.googleapis.com/v0/b/comm-unstable-fmlink/o/buildings%2F7Vs4BC4sfPFtbJPUyGCY%2Finspection_events%2FoXDdjUcHbvmHYa4hFsDz%2F2020-02-04T09%3A55%3A53.614122.pdf?alt=media&token=87309ef3-3c84-4c95-945c-45de898d8b23&widthmax=600",
  ],
};
