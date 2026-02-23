/**
 * Page Object Model for Hacker News Comments Page
 * Contains all selectors and methods for interacting with the comments page
 */
class CommentsPage {
  constructor(page) {
    this.page = page;
    
    // Stable selectors for comments page
    this.commentsList = 'table.comment-tree';
    this.comment = 'tr.comtr';
    this.commentText = 'tr.comtr span.commtext';
    this.storyTitle = 'table.fatitem tr.athing td.title span.titleline > a';
  }

  /**
   * Wait for comments page to load
   */
  async waitForPageToLoad() {
    // Wait for either comments or "No comments" message
    await this.page.waitForSelector('table.fatitem', { state: 'visible' });
  }

  /**
   * Get the count of comments on the page
   * @returns {Promise<number>} Number of comments
   */
  async getCommentCount() {
    const commentElements = this.page.locator(this.comment);
    return await commentElements.count();
  }

  /**
   * Check if at least one comment is present
   * @returns {Promise<boolean>} True if comments exist
   */
  async hasComments() {
    const count = await this.getCommentCount();
    return count > 0;
  }

  /**
   * Get the story title from comments page
   * @returns {Promise<string>} Story title
   */
  async getStoryTitle() {
    const titleElement = this.page.locator(this.storyTitle);
    await titleElement.waitFor({ state: 'visible' });
    return await titleElement.textContent();
  }
}

module.exports = CommentsPage;
