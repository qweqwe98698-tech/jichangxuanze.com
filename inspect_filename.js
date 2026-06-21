const fs = require('fs');
const content = fs.readFileSync('articles.html', 'utf8');
const match = content.match(/<a href="(blog-Vibe[^"]+)"/);
if (match) {
    console.log(match[1]);
    console.log('HEX:', Buffer.from(match[1]).toString('hex'));
} else {
    console.log('Not found');
}
