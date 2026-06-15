const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!fullPath.includes('.git') && !fullPath.includes('node_modules')) {
                processDir(fullPath);
            }
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            
            // Match href="something.html" or href="something.html#anchor"
            // Ensure it's a relative link (doesn't start with http or //)
            content = content.replace(/href="((?!http|\/\/)[^"]+)\.html(#[^"]*)?"/g, 'href="$1$2"');
            
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDir(__dirname + '/..');
console.log("Finished stripping .html extensions for Cloudflare Pages SPA compatibility.");
