const fs = require('fs');

const content = fs.readFileSync('articles.html', 'utf8');
const lines = content.split('\n');

for (const line of lines) {
    if (line.includes('<a href="blog-') && line.includes('class="article-list-item"')) {
        const match = line.match(/href="([^"]+)"/);
        if (match) {
            const file = match[1];
            const exists = fs.existsSync(file);
            console.log(`File in HTML: ${file} | Exists on disk? ${exists}`);
        }
    }
}
