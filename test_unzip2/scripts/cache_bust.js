const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace old version parameters
    let newContent = content.replace(/js\/app\.js\?v=\d+/g, 'js/app.js?v=20260615');
    
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent);
    }
});

console.log("Successfully cache busted js/app.js in all HTML files.");
