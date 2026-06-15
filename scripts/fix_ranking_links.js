const fs = require('fs');
const path = require('path');

const guangsuUrl = 'https://qwerty.gsyaff.com/#/?code=keqgvT5Y';
const rankingFile = path.join(__dirname, '..', 'ranking.html');

let content = fs.readFileSync(rankingFile, 'utf8');

// Replace href="#" where the class is "btn btn-primary tool-btn"
let newContent = content.replace(/href="#"(\s+target="_blank"\s+class="btn btn-primary tool-btn")/g, `href="${guangsuUrl}"$1`);

if (content !== newContent) {
    fs.writeFileSync(rankingFile, newContent);
    console.log('Successfully updated ranking.html');
} else {
    console.log('No empty links found in ranking.html');
}
