const fs = require('fs');
const path = require('path');

const toRemove = [
  path.join(process.cwd(), 'public', 'sw.js'),
  path.join(process.cwd(), '.sw-build-temp.js'),
  path.join(process.cwd(), 'lib', 'lang-slugs.json'),
];

toRemove.forEach((p) => {
  try {
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      console.log('Removed', p);
    }
  } catch (e) {
    console.warn('Failed to remove', p, e && e.message);
  }
});

console.log('Clean complete');
