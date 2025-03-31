import { Request, Response } from 'express';
import { setConfig, toHtml } from '../lib/index';
// import * as puppeteer from 'puppeteer-core';
// import chromium from '@sparticuz/chromium';
import nodeHtmlToImage from 'node-html-to-image'

export const ConvertToImage = async (request: Request, response: Response) => {
  try {
    const { json, config, options } = request.body;

    if (!json) {
      return response.status(400).json({ error: 'Missing JSON data' });
    }

    // Apply custom config if provided
    if (config) {
      setConfig(config);
    }

    // Convert to HTML first
    const htmlContent = toHtml(json);

    // Default style for the generated image
    const defaultStyle = `
      body {
        font-family: 'Arial', sans-serif;
        line-height: 1.6;
        color: #333;
        padding: 20px;
        max-width: 1440px;
        margin: 0 auto;
        background: white;
        height: 660px;
      }
      h1, h2, h3, h4, h5, h6 {
        margin-top: 1.5em;
        margin-bottom: 0.5em;
      }
      p {
        margin-bottom: 1em;
      }
      img {
        max-width: 100%;
      }
      ul, ol {
        margin-bottom: 1em;
        padding-left: 2em;
      }
      blockquote {
        margin: 1em 0;
        padding: 0.5em 1em;
        border-left: 4px solid #ddd;
        background-color: #f9f9f9;
      }
    `;

    // Create a full HTML document
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${defaultStyle}</style>
          ${options?.customCss ? `<style>${options.customCss}</style>` : ''}
        </head>
        <body>
          <div class="content">
            ${htmlContent}
          </div>
        </body>
      </html>
    `;

    // Setup Puppeteer with Chrome for serverless environment
    // const browser = await puppeteer.launch({
    //   args: chromium.args,
    //   defaultViewport: {
    //     width: options?.width || 800,
    //     height: options?.height || 600,
    //     deviceScaleFactor: options?.scale || 2
    //   },
    //   executablePath: process.env.NODE_ENV === 'production' 
    //     ? await chromium.executablePath()
    //     : process.platform === 'darwin' 
    //       ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' // Mac path
    //       : process.platform === 'win32' 
    //         ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' // Windows path
    //         : '/usr/bin/google-chrome', // Linux path
    //   headless: true
    // });

    // const page = await browser.newPage();
    // await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

    // // Get the actual height of the content
    // const contentHeight = await page.evaluate(() => {
    //   // Using document inside this function is fine because this code runs in the browser context, not Node
    //   const body = document.querySelector('body');
    //   return body ? body.getBoundingClientRect().height : 600;
    // });

    // // Adjust the viewport height to fit the content
    // await page.setViewport({
    //   width: options?.width || 800,
    //   height: Math.ceil(contentHeight),
    //   deviceScaleFactor: options?.scale || 2
    // });

    // // Take a screenshot
    // const imageBuffer = await page.screenshot({
    //   type: options?.format || 'png',
    //   quality: options?.format === 'jpeg' ? options?.quality || 90 : undefined,
    //   fullPage: true
    // });

    // await browser.close();

    // // Send image response

    const image = await nodeHtmlToImage({
      html: fullHtml,
      type: 'png',
      // puppeteer: puppeteer,
      quality: 80,
      content: { name: 'image' }
      // 直接輸出圖檔在專案下
      // output: './image123.jpeg',
    });
    response.setHeader('Content-Type', `image/${options?.format || 'png'}`);
    response.setHeader('Content-Disposition', `inline; filename="document.${options?.format || 'png'}"`);
    return response.send(image);
    // setHeader(event, 'Content-Type', `image/jpeg`);
    // return image;
  } catch (error) {
    console.error('Error converting to image:', error);
    return response.status(500).json({ 
      error: 'Failed to convert JSON to image',
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false
    });
  }
};