/**
 * Page Object Model for Hacker News Homepage
 * Contains all selectors and methods for interacting with the homepage
 */
class HomePage {
  constructor(page) {
    this.page = page;
    
    // Stable selectors for story elements
    // Hacker News uses tr.athing for story rows, no itemlist class on table
    this.storyRows = 'tr.athing';
    // Use nth-child to get the nth story row (1-based index)
    this.storyTitle = (index) => `tr.athing:nth-child(${index * 2 - 1}) td.title span.titleline > a`;
    this.storyLink = (index) => `tr.athing:nth-child(${index * 2 - 1}) td.title span.titleline > a`;
    this.storyScore = (index) => `tr.athing:nth-child(${index * 2 - 1}) + tr td.subtext span.score`;
    this.storyUser = (index) => `tr.athing:nth-child(${index * 2 - 1}) + tr td.subtext a.hnuser`;
    this.commentsLink = (index) => `tr.athing:nth-child(${index * 2 - 1}) + tr td.subtext a:has-text("comment")`;
    this.moreLink = 'a.morelink';
    this.storyList = 'table#hnmain';
  }

  /**
   * Navigate to Hacker News homepage
   */
  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
    await this.waitForStoriesToLoad();
  }

  /**
   * Wait for stories list to be visible
   */
  async waitForStoriesToLoad() {
    // Wait for main table to be visible
    await this.page.waitForSelector(this.storyList, { state: 'visible', timeout: 15000 });
    // Wait for at least one story row to be present
    await this.page.waitForSelector(this.storyRows, { state: 'visible', timeout: 15000 });
  }

  /**
   * Get the count of stories on the current page
   * @returns {Promise<number>} Number of stories
   */
  async getStoryCount() {
    return await this.page.locator(this.storyRows).count();
  }

  /**
   * Get story details by index (1-based)
   * @param {number} index - Story index (1-based)
   * @returns {Promise<Object>} Story object with title, link, score, user
   */
  async getStoryDetails(index) {
    const story = {
      title: null,
      link: null,
      score: null,
      user: null,
    };

    try {
      // Get the nth story row (0-based index)
      const storyRow = this.page.locator(this.storyRows).nth(index - 1);
      
      // Get title and link from the story row
      const titleElement = storyRow.locator('td.title span.titleline > a').first();
      if (await titleElement.count() > 0) {
        story.title = await titleElement.textContent();
        story.link = await titleElement.getAttribute('href');
        // Handle relative links - if it's an item link, make it absolute
        if (story.link && story.link.startsWith('item?id=')) {
          story.link = `https://news.ycombinator.com/${story.link}`;
        } else if (story.link && !story.link.startsWith('http')) {
          story.link = `https://news.ycombinator.com${story.link}`;
        }
      }

      // Get score and user from the next row (subtext row)
      // Use XPath to find the next sibling tr element
      const storyRowId = await storyRow.getAttribute('id');
      if (storyRowId) {
        // Use XPath to find next sibling tr with subtext
        const scoreElement = this.page.locator(`xpath=//tr[@id='${storyRowId}']/following-sibling::tr[1]//td[@class='subtext']//span[@class='score']`).first();
        if (await scoreElement.count() > 0) {
          const scoreText = await scoreElement.textContent();
          // Extract numeric value from "123 points"
          const match = scoreText?.match(/(\d+)/);
          story.score = match ? parseInt(match[1], 10) : null;
        }

        // Get user/author from subtext row using XPath
        const userElement = this.page.locator(`xpath=//tr[@id='${storyRowId}']/following-sibling::tr[1]//td[@class='subtext']//a[@class='hnuser']`).first();
        if (await userElement.count() > 0) {
          story.user = await userElement.textContent();
        }
      }
    } catch (error) {
      console.error(`Error getting story details for index ${index}:`, error);
    }

    return story;
  }

  /**
   * Get all stories on the current page
   * @returns {Promise<Array>} Array of story objects
   */
  async getAllStories() {
    const count = await this.getStoryCount();
    const stories = [];

    for (let i = 1; i <= count; i++) {
      try {
        const story = await Promise.race([
          this.getStoryDetails(i),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
        ]);
        stories.push(story);
      } catch (error) {
        // Add empty story if we can't get details
        stories.push({ title: null, link: null, score: null, user: null });
      }
    }

    return stories;
  }

  /**
   * Click on a story title by index
   * @param {number} index - Story index (1-based)
   * @returns {Promise<void>}
   */
  async clickStoryTitle(index) {
    const storyRow = this.page.locator(this.storyRows).nth(index - 1);
    const titleLink = storyRow.locator('td.title span.titleline > a').first();
    await titleLink.waitFor({ state: 'visible' });
    await titleLink.click();
  }

  /**
   * Click on comments link for a story by index
   * @param {number} index - Story index (1-based)
   * @returns {Promise<void>}
   */
  async clickCommentsLink(index) {
    const storyRow = this.page.locator(this.storyRows).nth(index - 1);
    const storyRowId = await storyRow.getAttribute('id');
    if (storyRowId) {
      const commentsLink = this.page.locator(`xpath=//tr[@id='${storyRowId}']/following-sibling::tr[1]//td[@class='subtext']//a[contains(text(), 'comment')]`).first();
      await commentsLink.waitFor({ state: 'visible' });
      await commentsLink.click();
    }
  }

  /**
   * Click the "More" link for pagination
   * @returns {Promise<void>}
   */
  async clickMoreLink() {
    const moreLink = this.page.locator(this.moreLink);
    await moreLink.waitFor({ state: 'visible' });
    await moreLink.click();
    // Wait for next page to load
    await this.page.waitForLoadState('networkidle');
    await this.waitForStoriesToLoad();
  }

  /**
   * Get the first story's title (for comparison)
   * @returns {Promise<string>} First story title
   */
  async getFirstStoryTitle() {
    const storyRow = this.page.locator(this.storyRows).first();
    const titleElement = storyRow.locator('td.title span.titleline > a').first();
    await titleElement.waitFor({ state: 'visible' });
    return await titleElement.textContent();
  }

  /**
   * Get all story titles on the page
   * @returns {Promise<Array<string>>} Array of story titles
   */
  async getAllStoryTitles() {
    const count = await this.getStoryCount();
    const titles = [];

    for (let i = 0; i < count; i++) {
      try {
        const storyRow = this.page.locator(this.storyRows).nth(i);
        const titleElement = storyRow.locator('td.title span.titleline > a').first();
        // Use a shorter timeout for each element
        if (await titleElement.count({ timeout: 2000 }) > 0) {
          const title = await titleElement.textContent({ timeout: 2000 });
          if (title) {
            titles.push(title.trim());
          }
        }
      } catch (error) {
        // Skip this story if it times out
        console.warn(`Could not get title for story ${i + 1}: ${error.message}`);
      }
    }

    return titles;
  }
}

module.exports = HomePage;
