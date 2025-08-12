import puppeteer from 'puppeteer'
import puppeteerCore from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

const isServerless = !!process.env.AWS_LAMBDA_FUNCTION_NAME || !!process.env.VERCEL || !!process.env.WEBSITE_INSTANCE_ID // Azure Functions

export async function launchPuppeteer() {
  if (isServerless) {
    console.log('########', process.env.WEBSITE_INSTANCE_ID)

    return await puppeteerCore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true, // use true/false here
      defaultViewport: { width: 1280, height: 800 },
    })
  } else {
    return await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: { width: 1280, height: 800 },
    })
  }
}
