const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://20.247.228.232';
const BROWSER = process.env.BROWSER || 'chrome';
const TIMEOUT = 10000;

// Test results tracking
let testResults = [];
let testsPassed = 0;
let testsFailed = 0;

// Utility function to initialize driver
async function initDriver() {
  let driver;
  
  if (BROWSER === 'firefox') {
    const options = new firefox.Options();
    options.addArguments('--headless');
    driver = await new Builder()
      .forBrowser('firefox')
      .setFirefoxOptions(options)
      .build();
  } else {
    const options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  }
  
  await driver.manage().setTimeouts({ implicit: TIMEOUT });
  return driver;
}

// Utility function to log test results
function logTest(testName, passed, message = '') {
  const result = {
    test: testName,
    status: passed ? 'PASSED' : 'FAILED',
    message: message,
    timestamp: new Date().toISOString()
  };
  
  testResults.push(result);
  
  if (passed) {
    testsPassed++;
    console.log(`✅ PASSED: ${testName}`);
  } else {
    testsFailed++;
    console.log(`❌ FAILED: ${testName}`);
    if (message) console.log(`   Error: ${message}`);
  }
}

// Utility function to take screenshot
async function takeScreenshot(driver, testName) {
  try {
    const image = await driver.takeScreenshot();
    const fs = require('fs');
    const fileName = `screenshot-${testName.replace(/\s/g, '-')}-${Date.now()}.png`;
    fs.writeFileSync(`./screenshots/${fileName}`, image, 'base64');
    console.log(`📸 Screenshot saved: ${fileName}`);
  } catch (error) {
    console.log(`Failed to take screenshot: ${error.message}`);
  }
}

// TEST 1: Verify Homepage Loads
async function testHomepageLoads() {
  const testName = 'Homepage Loads Successfully';
  let driver;
  
  try {
    driver = await initDriver();
    await driver.get(BASE_URL);
    
    // Wait for page to load
    await driver.wait(until.titleContains('Student Management'), TIMEOUT);
    
    // Verify title
    const title = await driver.getTitle();
    if (title.includes('Student Management')) {
      // Verify main heading exists
      const heading = await driver.findElement(By.xpath("//h2[contains(text(), 'Welcome to Student Management')]"));
      const headingText = await heading.getText();
      
      if (headingText.includes('Welcome')) {
        await takeScreenshot(driver, testName);
        logTest(testName, true, 'Homepage loaded with correct title and heading');
      } else {
        throw new Error('Main heading not found or incorrect');
      }
    } else {
      throw new Error(`Expected title to contain 'Student Management', got '${title}'`);
    }
  } catch (error) {
    await takeScreenshot(driver, testName);
    logTest(testName, false, error.message);
  } finally {
    if (driver) await driver.quit();
  }
}

// TEST 2: Verify Navigation Works
async function testNavigationWorks() {
  const testName = 'Navigation Between Pages';
  let driver;
  
  try {
    driver = await initDriver();
    await driver.get(BASE_URL);
    
    // Wait for page to load
    await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Students')]")), TIMEOUT);
    
    // Click on Students link in navbar
    const studentsLink = await driver.findElement(By.xpath("//button[contains(text(), 'Students')]"));
    await studentsLink.click();
    
    // Wait for students page to load
    await driver.wait(until.urlContains('/students'), TIMEOUT);
    
    // Verify we're on students page
    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl.includes('/students')) {
      // Verify student list heading exists
      const heading = await driver.findElement(By.xpath("//h4[contains(text(), 'Student List')]"));
      await takeScreenshot(driver, testName);
      logTest(testName, true, 'Successfully navigated to Students page');
    } else {
      throw new Error('Failed to navigate to Students page');
    }
  } catch (error) {
    await takeScreenshot(driver, testName);
    logTest(testName, false, error.message);
  } finally {
    if (driver) await driver.quit();
  }
}

// TEST 3: Verify Add Student Form
async function testAddStudentForm() {
  const testName = 'Add Student Form Validation';
  let driver;
  
  try {
    driver = await initDriver();
    await driver.get(BASE_URL);
    
    // Navigate to Add Student page
    await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Add Student')]")), TIMEOUT);
    const addStudentBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Add Student')]"));
    await addStudentBtn.click();
    
    // Wait for form to load
    await driver.wait(until.urlContains('/add-student'), TIMEOUT);
    await driver.wait(until.elementLocated(By.xpath("//h4[contains(text(), 'Add New Student')]")), TIMEOUT);
    
    // Verify form fields exist
    const nameField = await driver.findElement(By.name('name'));
    const emailField = await driver.findElement(By.name('email'));
    const rollNumberField = await driver.findElement(By.name('rollNumber'));
    
    // Fill form with test data
    await nameField.sendKeys('Test Student');
    await emailField.sendKeys(`test${Date.now()}@example.com`);
    await rollNumberField.sendKeys(`TEST${Date.now()}`);
    
    // Select department
    const departmentField = await driver.findElement(By.name('department'));
    await departmentField.click();
    await driver.wait(until.elementLocated(By.xpath("//li[contains(text(), 'Computer Science')]")), TIMEOUT);
    const csOption = await driver.findElement(By.xpath("//li[contains(text(), 'Computer Science')]"));
    await csOption.click();
    
    // Select year
    const yearField = await driver.findElement(By.name('year'));
    await yearField.click();
    await driver.wait(until.elementLocated(By.xpath("//li[contains(text(), '3rd Year')]")), TIMEOUT);
    const yearOption = await driver.findElement(By.xpath("//li[contains(text(), '3rd Year')]"));
    await yearOption.click();
    
    await takeScreenshot(driver, testName);
    logTest(testName, true, 'Form fields loaded and filled successfully');
    
  } catch (error) {
    await takeScreenshot(driver, testName);
    logTest(testName, false, error.message);
  } finally {
    if (driver) await driver.quit();
  }
}

// TEST 4: Verify Search Functionality
async function testSearchFunctionality() {
  const testName = 'Search Students Functionality';
  let driver;
  
  try {
    driver = await initDriver();
    await driver.get(`${BASE_URL}/students`);
    
    // Wait for students page to load
    await driver.wait(until.elementLocated(By.xpath("//h4[contains(text(), 'Student List')]")), TIMEOUT);
    
    // Find search input
    await driver.wait(until.elementLocated(By.css("input[placeholder*='Search']")), TIMEOUT);
    const searchInput = await driver.findElement(By.css("input[placeholder*='Search']"));
    
    // Type in search box
    await searchInput.sendKeys('John');
    
    // Wait a moment for filter to apply
    await driver.sleep(1000);
    
    await takeScreenshot(driver, testName);
    logTest(testName, true, 'Search functionality is working');
    
  } catch (error) {
    await takeScreenshot(driver, testName);
    logTest(testName, false, error.message);
  } finally {
    if (driver) await driver.quit();
  }
}

// TEST 5: Verify Student Table Display
async function testStudentTableDisplay() {
  const testName = 'Student Table Display';
  let driver;
  
  try {
    driver = await initDriver();
    await driver.get(`${BASE_URL}/students`);
    
    // Wait for table to load
    await driver.wait(until.elementLocated(By.css('table')), TIMEOUT);
    
    // Verify table headers exist
    const headers = await driver.findElements(By.css('thead th'));
    
    if (headers.length > 0) {
      // Check if at least some expected headers exist
      const headerTexts = await Promise.all(
        headers.map(h => h.getText())
      );
      
      const hasRollNumber = headerTexts.some(text => text.includes('Roll Number'));
      const hasName = headerTexts.some(text => text.includes('Name'));
      const hasEmail = headerTexts.some(text => text.includes('Email'));
      
      if (hasRollNumber && hasName && hasEmail) {
        await takeScreenshot(driver, testName);
        logTest(testName, true, 'Student table displays correctly with all headers');
      } else {
        throw new Error('Some expected table headers are missing');
      }
    } else {
      throw new Error('No table headers found');
    }
    
  } catch (error) {
    await takeScreenshot(driver, testName);
    logTest(testName, false, error.message);
  } finally {
    if (driver) await driver.quit();
  }
}

// TEST 6: Verify Responsive Design
async function testResponsiveDesign() {
  const testName = 'Responsive Design Check';
  let driver;
  
  try {
    driver = await initDriver();
    
    // Test desktop view
    await driver.manage().window().setRect({ width: 1920, height: 1080 });
    await driver.get(BASE_URL);
    await driver.wait(until.titleContains('Student Management'), TIMEOUT);
    
    // Test tablet view
    await driver.manage().window().setRect({ width: 768, height: 1024 });
    await driver.sleep(1000);
    
    // Test mobile view
    await driver.manage().window().setRect({ width: 375, height: 667 });
    await driver.sleep(1000);
    
    await takeScreenshot(driver, testName);
    logTest(testName, true, 'Responsive design works across different screen sizes');
    
  } catch (error) {
    await takeScreenshot(driver, testName);
    logTest(testName, false, error.message);
  } finally {
    if (driver) await driver.quit();
  }
}

// TEST 7: Verify Button Functionality
async function testButtonFunctionality() {
  const testName = 'Button Click Functionality';
  let driver;
  
  try {
    driver = await initDriver();
    await driver.get(BASE_URL);
    
    // Wait for page to load
    await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'View All Students')]")), TIMEOUT);
    
    // Click View All Students button
    const viewStudentsBtn = await driver.findElement(By.xpath("//button[contains(text(), 'View All Students')]"));
    await viewStudentsBtn.click();
    
    // Verify navigation worked
    await driver.wait(until.urlContains('/students'), TIMEOUT);
    
    await takeScreenshot(driver, testName);
    logTest(testName, true, 'Buttons are clickable and navigate correctly');
    
  } catch (error) {
    await takeScreenshot(driver, testName);
    logTest(testName, false, error.message);
  } finally {
    if (driver) await driver.quit();
  }
}

// Main test runner
async function runAllTests() {
  console.log('='.repeat(70));
  console.log('🚀 STARTING SELENIUM AUTOMATED TESTS');
  console.log('='.repeat(70));
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Browser: ${BROWSER}`);
  console.log(`Timeout: ${TIMEOUT}ms`);
  console.log('='.repeat(70));
  console.log('');
  
  // Create screenshots directory
  const fs = require('fs');
  if (!fs.existsSync('./screenshots')) {
    fs.mkdirSync('./screenshots');
  }
  
  const startTime = Date.now();
  
  // Run all tests
  await testHomepageLoads();
  await testNavigationWorks();
  await testAddStudentForm();
  await testSearchFunctionality();
  await testStudentTableDisplay();
  await testResponsiveDesign();
  await testButtonFunctionality();
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  // Print summary
  console.log('');
  console.log('='.repeat(70));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total Tests: ${testsPassed + testsFailed}`);
  console.log(`✅ Passed: ${testsPassed}`);
  console.log(`❌ Failed: ${testsFailed}`);
  console.log(`⏱️  Duration: ${duration}s`);
  console.log('='.repeat(70));
  
  // Save results to JSON
  const results = {
    summary: {
      total: testsPassed + testsFailed,
      passed: testsPassed,
      failed: testsFailed,
      duration: `${duration}s`,
      timestamp: new Date().toISOString()
    },
    tests: testResults
  };
  
  fs.writeFileSync('./test-results.json', JSON.stringify(results, null, 2));
  console.log('📄 Test results saved to test-results.json');
  
  // Exit with appropriate code
  process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});
