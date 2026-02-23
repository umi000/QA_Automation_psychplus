function extractScore(scoreText) {
  if (!scoreText) return null;
  const match = scoreText.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

function isExternalUrl(url) {
  if (!url) return false;
  return !url.includes('news.ycombinator.com') && !url.startsWith('/');
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function validateStory(story) {
  const errors = [];

  if (!story.title || story.title.trim() === '') {
    errors.push('Story is missing a title');
  }

  if (!story.link || story.link.trim() === '') {
    errors.push('Story is missing a link');
  }

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
