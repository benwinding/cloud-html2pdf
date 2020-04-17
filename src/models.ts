export interface PdfRequest {
  html: string;
  filename: string;
  imageResolution?: string;
  noMargin?: boolean;
  // Options from: https://github.com/puppeteer/puppeteer/blob/v3.0.0/docs/api.md#pagesetcontenthtml-options
  waitUntil?: 'networkidle0' | 'networkidle2' | 'load' | 'domcontentloaded';
}