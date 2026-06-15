const fs = require('fs');

['index.html', 'ranking.html'].forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Fallback: Remove everything from <!-- Exit Intent Modal --> to the next <!-- or </body>
    let startIdx = content.indexOf('<!-- Exit Intent Modal -->');
    if (startIdx !== -1) {
        let endIdx = content.indexOf('</body>', startIdx);
        if (endIdx !== -1) {
            content = content.substring(0, startIdx) + content.substring(endIdx);
        }
    }

    // Since I partially broke it before, let's remove any leftover button
    content = content.replace(/<button onclick="document\.getElementById\('exit-modal'\)[\s\S]*?<\/button>\s*<\/div>\s*<\/div>/, '');
    
    fs.writeFileSync(file, content);
    console.log('Cleaned ' + file);
});

// Also there is an apply_god_mode.js file that has this code
let godModeJs = fs.readFileSync('scripts/apply_god_mode.js', 'utf8');
godModeJs = godModeJs.replace(/const exitModalHtml = `[\s\S]*?`;/, '');
godModeJs = godModeJs.replace(/\/\/ 3\. Inject Exit Modal to ranking[\s\S]*?changed = true;\s*\}/, '');
fs.writeFileSync('scripts/apply_god_mode.js', godModeJs);
