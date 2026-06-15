const fs = require('fs');
['index.html', 'ranking.html'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/<!-- Exit Intent Modal -->[\s\S]*?<div id="exit-modal"[\s\S]*?<\/div>\s*<\/div>\n?/g, '');
  content = content.replace(/<!-- Exit Intent Modal -->[\s\S]*?<style>[\s\S]*?<\/style>\n?/g, '');
  fs.writeFileSync(file, content);
  console.log('Cleaned HTML in ' + file);
});
