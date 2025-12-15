# Selenium Automated Testing

This directory contains automated Selenium tests for the Student Management System.

## Prerequisites

1. **Install Node.js** (v14 or higher)
2. **Install Chrome browser** (for ChromeDriver)
3. **Install dependencies:**
   ```bash
   npm install
   ```

## Test Cases

The test suite includes the following automated tests:

### 1. Homepage Load Test
- Verifies the homepage loads successfully
- Checks page title and main heading
- **Expected Result**: Homepage displays with correct content

### 2. Navigation Test
- Tests navigation between pages
- Verifies navbar links work correctly
- **Expected Result**: Successfully navigates to Students page

### 3. Add Student Form Test
- Validates the Add Student form
- Fills out form fields
- Tests dropdown selections
- **Expected Result**: Form fields can be filled and submitted

### 4. Search Functionality Test
- Tests the search/filter feature
- Verifies search input works
- **Expected Result**: Search filters student list

### 5. Student Table Display Test
- Verifies student data table displays
- Checks all table columns exist
- **Expected Result**: Table shows with correct headers

### 6. Responsive Design Test
- Tests application on different screen sizes
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)
- **Expected Result**: UI adapts to different sizes

### 7. Button Functionality Test
- Tests button click actions
- Verifies navigation after clicks
- **Expected Result**: Buttons perform expected actions

## Running Tests

### Run All Tests
```bash
npm test
```

### Run with Chrome (default)
```bash
npm run test:chrome
```

### Run with Firefox
```bash
npm run test:firefox
```

### Run Simple Test
```bash
node simple-test.js
```

### Run Against Specific URL
```bash
BASE_URL=http://your-app-url.com npm test
```

## Test Configuration

Edit the following variables in `test-runner.js`:

```javascript
const BASE_URL = process.env.BASE_URL || 'http://localhost:80';
const BROWSER = process.env.BROWSER || 'chrome';
const TIMEOUT = 10000; // 10 seconds
```

## Test Output

### Console Output
Tests will display real-time results:
- ✅ Green checkmarks for passed tests
- ❌ Red X for failed tests
- 📸 Screenshot indicators
- 📊 Final summary with statistics

### Screenshots
Screenshots are automatically saved to `./screenshots/` directory:
- Captured on test failure for debugging
- Captured on test success for documentation
- Named with test name and timestamp

### JSON Report
Test results are saved to `test-results.json`:
```json
{
  "summary": {
    "total": 7,
    "passed": 7,
    "failed": 0,
    "duration": "45.23s"
  },
  "tests": [...]
}
```

## Before Running Tests

1. **Start the application:**
   ```bash
   # Using Docker Compose
   docker-compose up

   # Or manually
   cd backend && npm start
   cd frontend && npm start
   ```

2. **Verify application is accessible:**
   - Open browser to http://localhost:80
   - Ensure all services are running

3. **Run tests:**
   ```bash
   cd selenium-tests
   npm install
   npm test
   ```

## Common Issues

### ChromeDriver Version Mismatch
```bash
npm install chromedriver@latest
```

### Timeout Errors
Increase timeout in `test-runner.js`:
```javascript
const TIMEOUT = 20000; // 20 seconds
```

### Connection Refused
Verify application is running:
```bash
curl http://localhost:80
```

### Headless Mode Issues
Run in visible mode (remove `--headless` flag in test-runner.js):
```javascript
// Comment out this line
// options.addArguments('--headless');
```

## Integration with CI/CD

These tests can be integrated into your CI/CD pipeline:

```yaml
# Example GitHub Actions step
- name: Run Selenium Tests
  run: |
    cd selenium-tests
    npm install
    npm test
```

## Best Practices

1. **Wait for elements**: Always use `driver.wait()` instead of `driver.sleep()`
2. **Explicit waits**: Use `until.elementLocated()` for dynamic content
3. **Screenshots**: Capture on both pass and fail for documentation
4. **Cleanup**: Always call `driver.quit()` in finally blocks
5. **Unique data**: Use timestamps in test data to avoid conflicts

## Screenshots for Submission

For your exam submission, include:
1. Console output showing all tests passed
2. Screenshots from the `./screenshots/` directory
3. `test-results.json` file
4. This README documenting your test cases

## Extending Tests

To add new tests:

```javascript
async function testNewFeature() {
  const testName = 'My New Test';
  let driver;
  
  try {
    driver = await initDriver();
    await driver.get(BASE_URL);
    
    // Your test logic here
    
    logTest(testName, true, 'Test passed');
  } catch (error) {
    logTest(testName, false, error.message);
  } finally {
    if (driver) await driver.quit();
  }
}

// Add to runAllTests()
await testNewFeature();
```

## Troubleshooting

### Check Chrome Version
```bash
google-chrome --version
# or
chromium-browser --version
```

### Check ChromeDriver Version
```bash
npx chromedriver --version
```

### View Detailed Logs
Add verbose logging:
```javascript
const logging = require('selenium-webdriver/lib/logging');
driver.manage().logs().get(logging.Type.BROWSER);
```
