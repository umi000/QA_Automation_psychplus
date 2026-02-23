# Design Decisions

This document outlines the key design decisions made during the development of the Hacker News automation test suite.

## Architecture

### Page Object Model

I chose to implement the Page Object Model pattern for all page interactions. This approach separates test logic from page interaction details, making the codebase more maintainable. When the Hacker News UI changes, updates are centralized in the page objects rather than scattered across multiple test files.

The implementation includes two main page objects:
- `HomePage.js` - Handles all homepage interactions and selectors
- `CommentsPage.js` - Manages comments page interactions

### Folder Structure

The project is organized into three main directories:
- `pages/` - Page Object Model classes
- `tests/` - Test specifications
- `utils/` - Helper functions and utilities

This structure provides clear separation of concerns and makes it easy to locate and maintain code as the project grows.

## Selector Strategy

### CSS Selectors Over XPath

I primarily used CSS selectors based on HTML structure and classes rather than XPath. CSS selectors tend to be more stable, execute faster, and are generally more readable. They're also less brittle when the DOM structure changes slightly.

For example, story rows are selected using `tr.athing`, and story title links use `td.title span.titleline > a`.

### Handling Dynamic Content

Hacker News uses a table structure with predictable patterns. I used XPath only when necessary to navigate between sibling table rows, specifically for extracting score and user information from the subtext row that follows each story row.

## Wait Strategy

### Explicit Waits

Instead of using fixed timeouts or sleep statements, I implemented explicit waits with proper conditions. This approach is more reliable, executes faster, and handles dynamic content loading better.

The implementation uses:
- `waitForSelector()` with visibility state checks
- `waitForLoadState('networkidle')` for page loads
- Custom wait methods in Page Objects like `waitForStoriesToLoad()`

This reduces test flakiness and ensures tests wait only as long as necessary.

## Test Organization

### Test File Structure

Tests are organized to match the requirement sections (A, B, C, D):
- `homepage-validation.spec.js` - Section A requirements
- `sorting-validation.spec.js` - Section B requirements
- `navigation-workflow.spec.js` - Section C requirements
- `pagination.spec.js` - Section D requirements

This structure makes it easy to run specific requirement tests and provides clear mapping between requirements and test implementations.

### Test Naming

Test names are descriptive and explain what is being tested. For example, `should validate first page contains 30 items` clearly communicates the test's purpose without needing to read the implementation.

## Assertion Strategy

### Meaningful Assertions

All assertions include descriptive messages that provide context when tests fail. For example, `expect(storyCount, 'First page should contain 30 items').toBe(30)` clearly indicates what failed and what was expected.

### Optional Field Handling

Some stories may not have scores or authors yet, especially new submissions. The tests handle these optional fields gracefully by checking for null/undefined before validation. This prevents false failures while still validating data when it exists.

## Parallel Execution

Parallel execution is enabled by default in the Playwright configuration. This significantly reduces overall test execution time. The configuration uses 2 workers in CI environments and allows Playwright to determine optimal worker count locally.

Tests run on three browsers (Chromium, Firefox, WebKit) to ensure cross-browser compatibility and catch browser-specific issues.

## Error Handling

### Graceful Degradation

The tests are designed to be resilient. Optional elements that might not always be present are handled with try-catch blocks and conditional validation. This prevents tests from failing due to missing optional data.

### Failure Reporting

Screenshots, videos, and traces are captured on test failures. This provides visual evidence and detailed debugging information when tests fail, making it much easier to diagnose issues.

The configuration captures:
- Screenshots only on failure
- Videos only on failure
- Traces only on failure

This keeps artifact sizes manageable while providing necessary debugging information.

## Utility Functions

Common operations are extracted into reusable utility functions in `utils/helpers.js`. This follows the DRY principle and ensures consistent behavior across tests. Key utilities include:

- `validateStory()` - Validates story object structure
- `arraysAreDifferent()` - Compares arrays for pagination validation
- `extractScore()` - Parses score from text format
- `isExternalUrl()` - Checks if a URL is external

## Configuration Management

All Playwright configuration is centralized in `playwright.config.js`. This provides a single source of truth for timeouts, retries, reporters, and browser settings.

Timeouts are set to balance reliability and speed:
- Test timeout: 30s
- Action timeout: 10s
- Navigation timeout: 15s

These values handle slow network conditions while preventing tests from hanging indefinitely.

## External Link Handling

Hacker News stories can link to external sites or internal Hacker News pages. The navigation tests handle both scenarios by detecting when a new page/tab opens versus same-page navigation. This makes the tests more robust and realistic.

## Ranking Algorithm Considerations

Hacker News uses a complex ranking algorithm that considers time decay and other factors beyond raw scores. The sorting validation test acknowledges this complexity. When the top story has a lower score than the second story (due to time decay), the test logs this as expected behavior rather than failing, as per the requirement that we don't need to validate the backend ranking algorithm.

## Reporting

The project uses Playwright's built-in HTML reporter for detailed analysis and the list reporter for quick console output. The HTML reports include screenshots, videos, and traces, making them easy to share and review.
