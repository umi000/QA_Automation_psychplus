const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const { arraysAreDifferent } = require('../utils/helpers');

/**
 * Test Suite: Pagination
 * Requirements: Section D
 * 1. Click "More" at the bottom of the page
 * 2. Validate that the next page loads
 * 3. Validate that the story list is different from page 1
 */
test.describe('Pagination', () => {
  test('should click More and validate next page loads', async ({ page }) => {
    const homePage = new HomePage(page);
    
    await homePage.goto();
    
    // Verify we're on page 1
    await expect(page.locator(homePage.storyList)).toBeVisible();
    const initialStoryCount = await homePage.getStoryCount();
    expect(initialStoryCount, 'Page 1 should have stories').toBeGreaterThan(0);
    
    // Click "More" link
    await homePage.clickMoreLink();
    
    // Validate that the next page loads
    await expect(page.locator(homePage.storyList)).toBeVisible();
    
    // Verify stories are still present
    const nextPageStoryCount = await homePage.getStoryCount();
    expect(nextPageStoryCount, 'Next page should have stories').toBeGreaterThan(0);
  });

  test('should validate story list is different from page 1', async ({ page }) => {
    test.setTimeout(60000); // Increase timeout for this test
    const homePage = new HomePage(page);
    
    // Navigate to page 1
    await homePage.goto();
    
    // Get all story titles from page 1
    const page1Titles = await homePage.getAllStoryTitles();
    expect(page1Titles.length, 'Page 1 should have stories').toBeGreaterThan(0);
    
    // Click "More" to go to page 2
    await homePage.clickMoreLink();
    
    // Wait for page 2 to load
    await homePage.waitForStoriesToLoad();
    
    // Get all story titles from page 2
    const page2Titles = await homePage.getAllStoryTitles();
    expect(page2Titles.length, 'Page 2 should have stories').toBeGreaterThan(0);
    
    // Validate that the story list is different from page 1
    const areDifferent = arraysAreDifferent(page1Titles, page2Titles);
    expect(areDifferent, 
      'Page 2 story list should be different from page 1'
    ).toBe(true);
  });

  test('should validate pagination maintains 30 items per page', async ({ page }) => {
    const homePage = new HomePage(page);
    
    await homePage.goto();
    
    // Page 1 should have 30 items
    const page1Count = await homePage.getStoryCount();
    expect(page1Count, 'Page 1 should contain 30 items').toBe(30);
    
    // Navigate to page 2
    await homePage.clickMoreLink();
    await homePage.waitForStoriesToLoad();
    
    // Page 2 should also have 30 items
    const page2Count = await homePage.getStoryCount();
    expect(page2Count, 'Page 2 should contain 30 items').toBe(30);
  });

  test('should navigate through multiple pages', async ({ page }) => {
    const homePage = new HomePage(page);
    
    await homePage.goto();
    
    // Collect titles from first 3 pages
    const allTitles = [];
    
    for (let pageNum = 1; pageNum <= 3; pageNum++) {
      const titles = await homePage.getAllStoryTitles();
      allTitles.push(...titles);
      
      if (pageNum < 3) {
        await homePage.clickMoreLink();
        await homePage.waitForStoriesToLoad();
      }
    }
    
    // Verify we collected stories from multiple pages
    expect(allTitles.length, 'Should collect stories from multiple pages').toBeGreaterThan(30);
    
    // Verify no duplicate consecutive pages (each page should be different)
    // This is a basic check - in reality, stories might repeat across pages over time
    const uniqueTitles = new Set(allTitles);
    expect(uniqueTitles.size, 'Should have unique stories across pages').toBeGreaterThan(30);
  });
});
