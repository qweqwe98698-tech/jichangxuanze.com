const fs = require('fs');

let articles = fs.readFileSync('articles.html', 'utf8');
articles = articles.replace(/<!-- 新生成的文章 -->\s*<a href="blog-Vibe[^"]+"[\s\S]*?<\/a>/, '');
fs.writeFileSync('articles.html', articles);

let sitemap = fs.readFileSync('sitemap.xml', 'utf8');
sitemap = sitemap.replace(/<url>\s*<loc>[^<]+blog-Vibe[^<]+<\/loc>[\s\S]*?<\/url>/, '');
fs.writeFileSync('sitemap.xml', sitemap);

console.log("Cleaned up broken link!");
