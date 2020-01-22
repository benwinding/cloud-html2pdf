export interface PdfRequest {
  html: string;
  filename: string;
  imageResolution?: string;
  noMargin?: boolean;
}