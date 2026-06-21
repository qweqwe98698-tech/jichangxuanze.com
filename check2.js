const fs = require('fs');
const content = fs.readFileSync('articles.html', 'utf8');
const matches = content.match(/<a href="(blog-[^"]+)" class="article-list-item"/g);
if (matches) {
    console.log(matches.slice(0, 3));
}
