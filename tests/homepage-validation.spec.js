const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const { validateStory } = require('../utils/helpers');

/**
 * Test Suite: Homepage Validation
 * Requirements: Section A
 * - Navigate to https://news.ycombinator.com
 * - Validate that the top stories list loads
 * - Validate that each story has: title, link, score (if available), user/author (if available)
 */
test.describe('Homepage Validation', () => {
  test('should load homepage and validate top stories list', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Navigate to Hacker News
    await homePage.goto();
    
    // Validate that the top stories list loads
    await expect(page.locator(homePage.storyList)).toBeVisible();
    
    // Validate that at least one story is present
    const storyCount = await homePage.getStoryCount();
    expect(storyCount).toBeGreaterThan(0);
  });

  test('should validate each story has required elements', async ({ page }) => {
    const homePage = new HomePage(page);
    
    await homePage.goto();
    
    // Get all stories on the page
    const stories = await homePage.getAllStories();
    
    // Validate each story
    for (let i = 0; i < stories.length; i++) {
      const story = stories[i];
      const validation = validateStory(story);
      
      // Each story must have a title and link
      expect(validation.isValid, 
        `Story ${i + 1} validation failed: ${validation.errors.join(', ')}`
      ).toBe(true);
      
      // Validate title exists and is not empty
      expect(story.title, `Story ${i + 1} should have a title`).toBeTruthy();
      expect(story.title.trim().length, `Story ${i + 1} title should not be empty`).toBeGreaterThan(0);
      
      // Validate link exists and is not empty
      expect(story.link, `Story ${i + 1} should have a link`).toBeTruthy();
      expect(story.link.trim().length, `Story ${i + 1} link should not be empty`).toBeGreaterThan(0);
      
      // Score and user are optional, but if they exist, validate them
      if (story.score !== null && story.score !== undefined) {
        expect(typeof story.score, `Story ${i + 1} score should be numeric`).toBe('number');
        expect(story.score, `Story ${i + 1} score should be a positive number`).toBeGreaterThanOrEqual(0);
      }
      
      if (story.user !== null && story.user !== undefined) {
        expect(story.user.trim().length, `Story ${i + 1} user should not be empty if present`).toBeGreaterThan(0);
      }
    }
  });

  test('should validate story links are accessible', async ({ page }) => {
    const homePage = new HomePage(page);
    
    await homePage.goto();
    
    // Check first few stories have valid links
    const storyCount = Math.min(await homePage.getStoryCount(), 5);
    
    for (let i = 1; i <= storyCount; i++) {
      const story = await homePage.getStoryDetails(i);
      
      expect(story.link, `Story ${i} should have a link`).toBeTruthy();
      // Link should be a valid URL format
      expect(story.link, `Story ${i} link should be a valid URL`).toMatch(/^https?:\/\//);
    }
  });
});
