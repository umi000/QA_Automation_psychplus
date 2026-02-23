/**
 * Utility functions for test helpers
 */

/**
 * Extract numeric score from score text (e.g., "123 points" -> 123)
 * @param {string} scoreText - Score text from page
 * @returns {number|null} Numeric score or null
 */
function extractScore(scoreText) {
  if (!scoreText) return null;
  const match = scoreText.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Check if a URL is external (not Hacker News domain)
 * @param {string} url - URL to check
 * @returns {boolean} True if external
 */
function isExternalUrl(url) {
  if (!url) return false;
  return !url.includes('news.ycombinator.com') && !url.startsWith('/');
}

/**
 * Wait for a specific timeout
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Validate story object structure
 * @param {Object} story - Story object to validate
 * @returns {Object} Validation result with isValid and errors
 */
function validateStory(story) {
  const errors = [];

  if (!story.title || story.title.trim() === '') {
    errors.push('Story is missing a title');
  }

  if (!story.link || story.link.trim() === '') {
    errors.push('Story is missing a link');
  }

  // Score and user are optional, but if score exists, it should be numeric
  if (story.score !== null && story.score !== undefined) {
    if (typeof story.score !== 'number' || isNaN(story.score)) {
      errors.push('Story score is not numeric');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Compare two arrays to check if they are different
 * @param {Array} array1 - First array
 * @param {Array} array2 - Second array
 * @returns {boolean} True if arrays are different
 */
function arraysAreDifferent(array1, array2) {
  if (array1.length !== array2.length) return true;
  
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return true;
    }
  }
  
  return false;
}

module.exports = {
  extractScore,
  isExternalUrl,
  wait,
  validateStory,
  arraysAreDifferent,
};
