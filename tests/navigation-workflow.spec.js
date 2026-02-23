const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const CommentsPage = require('../pages/CommentsPage');
const { isExternalUrl } = require('../utils/helpers');

/**
 * Test Suite: Navigation Workflow
 * Requirements: Section C
 * 1. Click the first story title
 * 2. Validate that the external link opens
 * 3. Navigate back
 * 4. Click the "comments" link
 * 5. Validate that the comments page loads
 * 6. Validate that at least one comment is present (if available)
 */
test.describe('Navigation Workflow', () => {
  test('should click first story, validate external link, and navigate back', async ({ page, context }) => {
    const homePage = new HomePage(page);
    
    await homePage.goto();
    
    // Get the first story details before clicking
    const firstStory = await homePage.getStoryDetails(1);
    expect(firstStory.link, 'First story should have a link').toBeTruthy();
    
    // Click the first story title
    // Note: Hacker News stories can link to external sites or internal pages
    const [newPage] = await Promise.all([
      context.waitForEvent('page', { timeout: 10000 }).catch(() => null),
      homePage.clickStoryTitle(1),
    ]);
    
    // If a new page opened (external link), validate it
    if (newPage) {
      await newPage.waitForLoadState('networkidle');
      
      // Validate that the external link opened
      const newPageUrl = newPage.url();
      expect(newPageUrl, 'New page should have a valid URL').toBeTruthy();
      
      // Close the new page
      await newPage.close();
    } else {
      // Story might link to internal Hacker News page, wait for navigation
      await page.waitForLoadState('networkidle');
      // If we're on a different page, navigate back
      if (!page.url().includes('news.ycombinator.com')) {
        await page.goBack();
        await homePage.waitForStoriesToLoad();
      }
    }
    
    // Navigate back to homepage if not already there
    if (!page.url().includes('news.ycombinator.com') || page.url().includes('/item')) {
      await page.goto('https://news.ycombinator.com');
      await homePage.waitForStoriesToLoad();
    }
    
    // Verify we're back on the homepage
    await expect(page.locator(homePage.storyList)).toBeVisible();
  });

  test('should click comments link and validate comments page loads', async ({ page }) => {
    const homePage = new HomePage(page);
    const commentsPage = new CommentsPage(page);
    
    await homePage.goto();
    
    // Click the "comments" link for the first story
    await homePage.clickCommentsLink(1);
    
    // Wait for comments page to load
    await commentsPage.waitForPageToLoad();
    
    // Validate that the comments page loads
    // Check for story title element which is always present on comments page
    await expect(page.locator(commentsPage.storyTitle)).toBeVisible({ timeout: 10000 });
    
    // Validate that at least one comment is present (if available)
    const hasComments = await commentsPage.hasComments();
    
    if (hasComments) {
      const commentCount = await commentsPage.getCommentCount();
      expect(commentCount, 'Comments page should have at least one comment').toBeGreaterThan(0);
      
      // Verify comment elements are visible
      await expect(page.locator(commentsPage.comment).first()).toBeVisible();
    } else {
      // If no comments, that's acceptable - just log it
      console.log('No comments available for this story - this is acceptable');
    }
  });

  test('should complete full navigation workflow', async ({ page, context }) => {
    test.setTimeout(60000); // Increase timeout for this longer test
    const homePage = new HomePage(page);
    const commentsPage = new CommentsPage(page);
    
    // Step 1: Navigate to homepage
    await homePage.goto();
    await expect(page.locator(homePage.storyList)).toBeVisible();
    
    // Step 2: Click first story title
    const firstStoryTitle = await homePage.getFirstStoryTitle();
    expect(firstStoryTitle, 'First story should have a title').toBeTruthy();
    
    // Step 3: Click and handle external link
    const [newPage] = await Promise.all([
      context.waitForEvent('page', { timeout: 10000 }).catch(() => null),
      homePage.clickStoryTitle(1),
    ]);
    
    if (newPage) {
      await newPage.waitForLoadState('networkidle');
      const externalUrl = newPage.url();
      expect(externalUrl, 'External link should open').toBeTruthy();
      await newPage.close();
    } else {
      // If internal link, wait for navigation and go back if needed
      await page.waitForLoadState('networkidle');
      if (!page.url().includes('news.ycombinator.com') || page.url().includes('/item')) {
        await page.goBack();
        await homePage.waitForStoriesToLoad();
      }
    }
    
    // Step 4: Navigate back to homepage if not already there
    if (!page.url().includes('news.ycombinator.com') || page.url().includes('/item')) {
      await page.goto('https://news.ycombinator.com');
      await homePage.waitForStoriesToLoad();
    }
    
    // Step 5: Click comments link
    await homePage.clickCommentsLink(1);
    
    // Step 6: Validate comments page
    await commentsPage.waitForPageToLoad();
    await expect(page.locator(commentsPage.storyTitle)).toBeVisible();
    
    // Step 7: Check for comments
    const hasComments = await commentsPage.hasComments();
    if (hasComments) {
      const commentCount = await commentsPage.getCommentCount();
      expect(commentCount).toBeGreaterThan(0);
    }
  });
});
