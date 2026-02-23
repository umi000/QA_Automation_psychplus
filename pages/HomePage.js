class HomePage {
  constructor(page) {
    this.page = page;
    this.storyRows = 'tr.athing';
    this.storyTitle = (index) => `tr.athing:nth-child(${index * 2 - 1}) td.title span.titleline > a`;
    this.storyLink = (index) => `tr.athing:nth-child(${index * 2 - 1}) td.title span.titleline > a`;
    this.storyScore = (index) => `tr.athing:nth-child(${index * 2 - 1}) + tr td.subtext span.score`;
    this.storyUser = (index) => `tr.athing:nth-child(${index * 2 - 1}) + tr td.subtext a.hnuser`;
    this.commentsLink = (index) => `tr.athing:nth-child(${index * 2 - 1}) + tr td.subtext a:has-text("comment")`;
    this.moreLink = 'a.morelink';
    this.storyList = 'table#hnmain';
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
    await this.waitForStoriesToLoad();
  }

  async waitForStoriesToLoad() {
    await this.page.waitForSelector(this.storyList, { state: 'visible', timeout: 15000 });
    await this.page.waitForSelector(this.storyRows, { state: 'visible', timeout: 15000 });
  }

  async getStoryCount() {
    return await this.page.locator(this.storyRows).count();
  }

  async getStoryDetails(index) {
    const story = {
      title: null,
      link: null,
      score: null,
      user: null,
    };

    try {
      const storyRow = this.page.locator(this.storyRows).nth(index - 1);
      
      const titleElement = storyRow.locator('td.title span.titleline > a').first();
      if (await titleElement.count() > 0) {
        story.title = await titleElement.textContent();
        story.link = await titleElement.getAttribute('href');
        if (story.link && story.link.startsWith('item?id=')) {
          story.link = `https://news.ycombinator.com/${story.link}`;
        } else if (story.link && !story.link.startsWith('http')) {
          story.link = `https://news.ycombinator.com${story.link}`;
        }
      }

      const storyRowId = await storyRow.getAttribute('id');
      if (storyRowId) {
        const scoreElement = this.page.locator(`xpath=//tr[@id='${storyRowId}']/following-sibling::tr[1]//td[@class='subtext']//span[@class='score']`).first();
        if (await scoreElement.count() > 0) {
          const scoreText = await scoreElement.textContent();
          const match = scoreText?.match(/(\d+)/);
          story.score = match ? parseInt(match[1], 10) : null;
        }

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
        stories.push({ title: null, link: null, score: null, user: null });
      }
    }

    return stories;
  }

  async clickStoryTitle(index) {
    const storyRow = this.page.locator(this.storyRows).nth(index - 1);
    const titleLink = storyRow.locator('td.title span.titleline > a').first();
    await titleLink.waitFor({ state: 'visible' });
    await titleLink.click();
  }

  async clickCommentsLink(index) {
    const storyRow = this.page.locator(this.storyRows).nth(index - 1);
    const storyRowId = await storyRow.getAttribute('id');
    if (storyRowId) {
      const commentsLink = this.page.locator(`xpath=//tr[@id='${storyRowId}']/following-sibling::tr[1]//td[@class='subtext']//a[contains(text(), 'comment')]`).first();
      await commentsLink.waitFor({ state: 'visible' });
      await commentsLink.click();
    }
  }

  async clickMoreLink() {
    const moreLink = this.page.locator(this.moreLink);
    await moreLink.waitFor({ state: 'visible' });
    await moreLink.click();
    await this.page.waitForLoadState('networkidle');
    await this.waitForStoriesToLoad();
  }

  async getFirstStoryTitle() {
    const storyRow = this.page.locator(this.storyRows).first();
    const titleElement = storyRow.locator('td.title span.titleline > a').first();
    await titleElement.waitFor({ state: 'visible' });
    return await titleElement.textContent();
  }

  async getAllStoryTitles() {
    const count = await this.getStoryCount();
    const titles = [];

    for (let i = 0; i < count; i++) {
      try {
        const storyRow = this.page.locator(this.storyRows).nth(i);
        const titleElement = storyRow.locator('td.title span.titleline > a').first();
        if (await titleElement.count({ timeout: 2000 }) > 0) {
          const title = await titleElement.textContent({ timeout: 2000 });
          if (title) {
            titles.push(title.trim());
          }
        }
      } catch (error) {
        console.warn(`Could not get title for story ${i + 1}: ${error.message}`);
      }
    }

    return titles;
  }
}

module.exports = HomePage;
