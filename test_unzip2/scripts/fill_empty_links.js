const fs = require('fs');
const path = require('path');

const guangsuUrl = 'https://qwerty.gsyaff.com/#/?code=keqgvT5Y';

// Function to replace empty links safely
function replaceEmptyLinks(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    let originalContent = content;

    // Pattern 1: Review pages -> href="#" target="_blank" class="btn btn-primary"
    content = content.replace(/href="#"(\s+target="_blank"\s+class="btn btn-primary")/g, `href="${guangsuUrl}"$1`);
    
    // Pattern 2: Ranking page -> href="#" target="_blank" class="btn btn-primary tool-btn"
    content = content.replace(/href="#"(\s+target="_blank"\s+class="btn btn-primary tool-btn")/g, `href="${guangsuUrl}"$1`);

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated: ${filePath}`);
    }
}

// Process ranking.html
const rankingFile = path.join(__dirname, '..', 'ranking.html');
if (fs.existsSync(rankingFile)) {
    replaceEmptyLinks(rankingFile);
}

// Process review-*.html files
const dir = path.join(__dirname, '..');
const files = fs.readdirSync(dir);
files.filter(f => f.startsWith('review-') && f.endsWith('.html')).forEach(file => {
    replaceEmptyLinks(path.join(dir, file));
});

console.log("All empty airport links have been replaced with Guangsu Cloud link.");
