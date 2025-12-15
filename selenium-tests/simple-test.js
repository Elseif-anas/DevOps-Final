const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:80';

// Simple test example for demonstration
async function simpleTest() {
  // Setup Chrome options
  const options = new chrome.Options();
  options.addArguments('--headless');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  
  // Create driver
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  
  try {
    console.log('Opening application...');
    await driver.get(BASE_URL);
    
    console.log('Waiting for page to load...');
    await driver.wait(until.titleContains('Student Management'), 10000);
    
    const title = await driver.getTitle();
    console.log('Page title:', title);
    
    // Take screenshot
    const image = await driver.takeScreenshot();
    const fs = require('fs');
    if (!fs.existsSync('./screenshots')) {
      fs.mkdirSync('./screenshots');
    }
    fs.writeFileSync('./screenshots/simple-test.png', image, 'base64');
    console.log('Screenshot saved!');
    
    console.log('✅ Test passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await driver.quit();
  }
}

simpleTest();
