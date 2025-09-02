const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'service-worker.js');

// Generate a unique revision number based on the current timestamp
const revision = new Date().getTime().toString();

// Read the file content
let content = fs.readFileSync(filePath, 'utf8');

// Replace the revision numbers for your routes
content = content.replace(/'\/'\,\ revision\:\ '\d+'/, `'/', revision: '${revision}'`);
content = content.replace(/'\/en\/dashboard'\,\ revision\:\ '\d+'/, `'/en/dashboard', revision: '${revision}'`);
content = content.replace(/'\/en\/introduction'\,\ revision\:\ '\d+'/, `'/en/introduction', revision: '${revision}'`);
content = content.replace(/'\/en\/course-information'\,\ revision\:\ '\d+'/, `'/en/course-information', revision: '${revision}'`);
content = content.replace(/'\/en\/intro-to-course'\,\ revision\:\ '\d+'/, `'/en/intro-to-course', revision: '${revision}'`);
content = content.replace(/'\/en\/seeking-god'\,\ revision\:\ '\d+'/, `'/en/seeking-god', revision: '${revision}'`);
content = content.replace(/'\/en\/word'\,\ revision\:\ '\d+'/, `'/en/word', revision: '${revision}'`);

// Write the updated file
fs.writeFileSync(filePath, content, 'utf8');

console.log('Service worker revisions updated successfully!');
