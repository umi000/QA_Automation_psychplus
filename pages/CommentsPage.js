class CommentsPage {
  constructor(page) {
    this.page = page;
    this.commentsList = 'table.comment-tree';
    this.comment = 'tr.comtr';
    this.commentText = 'tr.comtr span.commtext';
    this.storyTitle = 'table.fatitem tr.athing td.title span.titleline > a';
  }

  async waitForPageToLoad() {
    await this.page.waitForSelector('table.fatitem', { state: 'visible' });
  }

  async getCommentCount() {
    const commentElements = this.page.locator(this.comment);
    return await commentElements.count();
  }

  async hasComments() {
    const count = await this.getCommentCount();
    return count > 0;
  }

  async getStoryTitle() {
    const titleElement = this.page.locator(this.storyTitle);
    await titleElement.waitFor({ state: 'visible' });
    return await titleElement.textContent();
  }
}

module.exports = CommentsPage;
