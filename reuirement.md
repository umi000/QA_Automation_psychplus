Take‑Home Assignment: Web UI Automation (Playwright)
Application: Hacker News (Y Combinator)
---
1. Overview
This assignment evaluates your ability to automate a real, production website with simple but
meaningful UI interactions.
Estimated effort: 4–6 hours
---
2. Application Under Test
Hacker News
https://news.ycombinator.com
Hacker News is a minimalist, stable site ideal for testing navigation, sorting, and content
validation.
---
3. Requirements
A. Homepage Validation
Automate:
1. Navigate to https://news.ycombinator.com
2. Validate that the top stories list loads
3. Validate that each story has:• A title
• A link
• A score (if available)
• A user/author (if available)
---
B. Sorting / Ranking Validation
Hacker News ranks stories by score. Validate:
• The first page contains 30 items
• Scores are numeric
• The top story has a score greater than or equal to the second story
(You do not need to validate the backend ranking algorithm — just basic ordering.)
---
C. Navigation Workflow
1. Click the first story title
2. Validate that the external link opens
3. Navigate back
4. Click the “comments” link
5. Validate that the comments page loads
6. Validate that at least one comment is present (if available)
---
D. Pagination
1. Click “More” at the bottom of the page
2. Validate that the next page loads
3. Validate that the story list is different from page 1
---
4. Automation Quality Expectations
• Page Object Model
• Reusable utilities
• Stable selectors
• Proper waits
• Meaningful assertions
• Parallel execution enabled
• Clean folder structure
---
5. Deliverables
• GitHub repository
• README with setup + execution instructions
• 1–2 page test plan
• Explanation of design decisions
• Optional: HTML report, screenshots, CI pipeliner