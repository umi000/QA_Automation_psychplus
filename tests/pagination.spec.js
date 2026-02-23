const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const { arraysAreDifferent } = require('../utils/helpers');

test.describe('Pagination', () => {
  test('should click More and validate next page loads', async ({ page }) => {
    const homePage = new HomePage(page);
    
    await homePage.goto();
    await expect(page.locator(homePage.storyList)).toBeVisible();
    
    const initialStoryCount = await homePage.getStoryCount();
    expect(initialStoryCount, 'Page 1 should have stories').toBeGreaterThan(0);
    
    await homePage.clickMoreLink();
    await expect(page.locator(homePage.storyList)).toBeVisible();
    
    const nextPageStoryCount = await homePage.getStoryCount();
    expect(nextPageStoryCount, 'Next page should have stories').toBeGreaterThan(0);
  });

  test('should validate story list is different from page 1', async ({ page }) => {
    test.setTimeout(60000);
    const homePage = new HomePage(page);
    
    await homePage.goto();
    const page1Titles = await homePage.getAllStoryTitles();
    expect(page1Titles.length, 'Page 1 should have stories').toBeGreaterThan(0);
    
    await homePage.clickMoreLink();
    await homePage.waitForStoriesToLoad();
    
    const page2Titles = await homePage.getAllStoryTitles();
    expect(page2Titles.length, 'Page 2 should have stories').toBeGreaterThan(0);
    
    const areDifferent = arraysAreDifferent(page1Titles, page2Titles);
    expect(areDifferent, 
      'Page 2 story list should be different from page 1'
    ).toBe(true);
  });

  test('should validate pagination maintains 30 items per page', async ({ page }) => {
    const homePage = new HomePage(page);
    
    await homePage.goto();
    const page1Count = await homePage.getStoryCount();
    expect(page1Count, 'Page 1 should contain 30 items').toBe(30);
    
    await homePage.clickMoreLink();
    await homePage.waitForStoriesToLoad();
    
    const page2Count = await homePage.getStoryCount();
    expect(page2Count, 'Page 2 should contain 30 items').toBe(30);
  });

  test('should navigate through multiple pages', async ({ page }) => {
    const homePage = new HomePage(page);
    
    await homePage.goto();
    const allTitles = [];
    
    for (let pageNum = 1; pageNum <= 3; pageNum++) {
      const titles = await homePage.getAllStoryTitles();
      allTitles.push(...titles);
      
      if (pageNum < 3) {
        await homePage.clickMoreLink();
        await homePage.waitForStoriesToLoad();
      }
    }
    
    expect(allTitles.length, 'Should collect stories from multiple pages').toBeGreaterThan(30);
    
    const uniqueTitles = new Set(allTitles);
    expect(uniqueTitles.size, 'Should have unique stories across pages').toBeGreaterThan(30);
  });
});
