# Hacker News Playwright Automation

This project contains automated tests for [Hacker News](https://news.ycombinator.com) using Playwright. The tests validate homepage functionality, story ranking, navigation workflows, and pagination.

## 📋 Requirements

- Node.js (v16 or higher)
- npm or yarn

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Playwright Browsers

```bash
npx playwright install
```

This will install Chromium, Firefox, and WebKit browsers required for testing.

### 3. Verify Installation

```bash
npx playwright --version
```

## 🧪 Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Headed Mode (See Browser)

```bash
npm run test:headed
```

### Run Tests with UI Mode (Interactive)

```bash
npm run test:ui
```

### Run Tests in Debug Mode

```bash
npm run test:debug
```

### Run Specific Test Suites

```bash
# Homepage validation tests
npm run test:homepage

# Sorting/ranking validation tests
npm run test:sorting

# Navigation workflow tests
npm run test:navigation

# Pagination tests
npm run test:pagination
```

### Run Tests on Specific Browsers

```bash
# Chromium only
npx playwright test --project=chromium

# Firefox only
npx playwright test --project=firefox

# WebKit (Safari) only
npx playwright test --project=webkit
```

## 📊 View Test Reports

After running tests, view the HTML report:

```bash
npm run test:report
```

This will open an interactive HTML report showing:
- Test results and status
- Screenshots on failure
- Videos on failure
- Execution traces

## 📁 Project Structure

```
.
├── pages/                    # Page Object Model classes
│   ├── HomePage.js          # Homepage page object
│   └── CommentsPage.js      # Comments page object
├── tests/                    # Test files
│   ├── homepage-validation.spec.js
│   ├── sorting-validation.spec.js
│   ├── navigation-workflow.spec.js
│   └── pagination.spec.js
├── utils/                    # Utility functions
│   └── helpers.js
├── playwright.config.js      # Playwright configuration
├── package.json
├── README.md
├── TEST_PLAN.md             # Test plan document
└── DESIGN_DECISIONS.md      # Design decisions document
```

## 🎯 Test Coverage

### A. Homepage Validation
- ✅ Navigate to Hacker News
- ✅ Validate top stories list loads
- ✅ Validate each story has title, link, score (if available), user (if available)

### B. Sorting / Ranking Validation
- ✅ First page contains 30 items
- ✅ Scores are numeric
- ✅ Top story score >= second story score

### C. Navigation Workflow
- ✅ Click first story title
- ✅ Validate external link opens
- ✅ Navigate back
- ✅ Click comments link
- ✅ Validate comments page loads
- ✅ Validate at least one comment is present (if available)

### D. Pagination
- ✅ Click "More" link
- ✅ Validate next page loads
- ✅ Validate story list is different from page 1

## 🔧 Configuration

The `playwright.config.js` file contains:
- **Parallel execution**: Enabled by default
- **Retries**: 2 retries in CI, 0 locally
- **Timeouts**: 30s test timeout, 10s action timeout, 15s navigation timeout
- **Reporters**: HTML and list reporters
- **Browsers**: Chromium, Firefox, WebKit

## 🚀 CI/CD Pipeline

This project includes a GitHub Actions CI pipeline that automatically runs tests on push and pull requests.

### CI Workflow Features

- **Multi-browser testing**: Tests run on Chromium, Firefox, and WebKit
- **Parallel execution**: Tests run in parallel for faster execution
- **Artifact uploads**: Test reports and videos are uploaded on failure
- **Automatic triggers**: Runs on push to main/master/develop branches and on pull requests

### CI Configuration

The CI pipeline is configured in `.github/workflows/ci.yml` and:
- Uses Node.js 18
- Installs dependencies with `npm ci`
- Runs tests on all three browsers (Chromium, Firefox, WebKit)
- Uploads test reports and failure artifacts
- Provides a test summary job

### Viewing CI Results

1. Go to the **Actions** tab in your GitHub repository
2. Click on the workflow run to see detailed results
3. Download artifacts (reports, videos) from failed test runs

## 📝 Best Practices Implemented

- ✅ **Page Object Model**: All page interactions abstracted into reusable classes
- ✅ **Reusable Utilities**: Helper functions for common operations
- ✅ **Stable Selectors**: CSS selectors that are less likely to break
- ✅ **Proper Waits**: Network idle, element visibility, and explicit waits
- ✅ **Meaningful Assertions**: Clear error messages and validation logic
- ✅ **Parallel Execution**: Tests run in parallel for faster execution
- ✅ **Clean Structure**: Organized folder structure with separation of concerns

## 🐛 Troubleshooting

### Tests Fail with Timeout Errors

- Increase timeout in `playwright.config.js`
- Check network connectivity
- Verify Hacker News is accessible

### Browser Installation Issues

```bash
# Reinstall browsers
npx playwright install --force
```

### Screenshots and Videos

Screenshots and videos are automatically captured on test failures and stored in:
- `test-results/` directory

## 📄 License

MIT

## 👤 Author

Created as part of a take-home assignment for Web UI Automation.
