const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const CommentsPage = require('../pages/CommentsPage');

test.describe('Navigation Workflow', () => {
  test('should click first story, validate external link, and navigate back', async ({ page, context }) => {
    const homePage = new HomePage(page);
    
    await homePage.goto();
    
    const firstStory = await homePage.getStoryDetails(1);
    expect(firstStory.link, 'First story should have a link').toBeTruthy();
    
    const [newPage] = await Promise.all([
      context.waitForEvent('page', { timeout: 10000 }).catch(() => null),
      homePage.clickStoryTitle(1),
    ]);
    
    if (newPage) {
      await newPage.waitForLoadState('networkidle');
      const newPageUrl = newPage.url();
      expect(newPageUrl, 'New page should have a valid URL').toBeTruthy();
      await newPage.close();
    } else {
      await page.waitForLoadState('networkidle');
      if (!page.url().includes('news.ycombinator.com')) {
        await page.goBack();
        await homePage.waitForStoriesToLoad();
      }
    }
    
    if (!page.url().includes('news.ycombinator.com') || page.url().includes('/item')) {
      await page.goto('https://news.ycombinator.com');
      await homePage.waitForStoriesToLoad();
    }
    
    await expect(page.locator(homePage.storyList)).toBeVisible();
  });

  test('should click comments link and validate comments page loads', async ({ page }) => {
    const homePage = new HomePage(page);
    const commentsPage = new CommentsPage(page);
    
    await homePage.goto();
    await homePage.clickCommentsLink(1);
    await commentsPage.waitForPageToLoad();
    
    await expect(page.locator(commentsPage.storyTitle)).toBeVisible({ timeout: 10000 });
    
    const hasComments = await commentsPage.hasComments();
    
    if (hasComments) {
      const commentCount = await commentsPage.getCommentCount();
      expect(commentCount, 'Comments page should have at least one comment').toBeGreaterThan(0);
      await expect(page.locator(commentsPage.comment).first()).toBeVisible();
    } else {
      console.log('No comments available for this story - this is acceptable');
    }
  });

  test('should complete full navigation workflow', async ({ page, context }) => {
    test.setTimeout(60000);
    const homePage = new HomePage(page);
    const commentsPage = new CommentsPage(page);
    
    await homePage.goto();
    await expect(page.locator(homePage.storyList)).toBeVisible();
    
    const firstStoryTitle = await homePage.getFirstStoryTitle();
    expect(firstStoryTitle, 'First story should have a title').toBeTruthy();
    
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
      await page.waitForLoadState('networkidle');
      if (!page.url().includes('news.ycombinator.com') || page.url().includes('/item')) {
        await page.goBack();
        await homePage.waitForStoriesToLoad();
      }
    }
    
    if (!page.url().includes('news.ycombinator.com') || page.url().includes('/item')) {
      await page.goto('https://news.ycombinator.com');
      await homePage.waitForStoriesToLoad();
    }
    
    await homePage.clickCommentsLink(1);
    await commentsPage.waitForPageToLoad();
    await expect(page.locator(commentsPage.storyTitle)).toBeVisible();
    
    const hasComments = await commentsPage.hasComments();
    if (hasComments) {
      const commentCount = await commentsPage.getCommentCount();
      expect(commentCount).toBeGreaterThan(0);
    }
  });
});
