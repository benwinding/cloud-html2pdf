import * as Pupeteer from 'puppeteer';

export async function launchChromeInstance() {
  const browser = await Pupeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
    executablePath: '/usr/bin/google-chrome'
  });
  return browser;
}