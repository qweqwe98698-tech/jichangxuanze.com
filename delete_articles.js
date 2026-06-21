const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const articlesHtmlPath = path.join(rootDir, 'articles.html');
const sitemapPath = path.join(rootDir, 'sitemap.xml');

// The titles to delete (or keywords that uniquely identify them)
const keywords = [
    "AI时代挣到钱了吗",
    "为了省点API钱",
    "Vibe Coding"
];

// 1. Delete from articles.html
let articlesContent = fs.readFileSync(articlesHtmlPath, 'utf8');
const articleBlockRegex = /<!-- 新生成的文章 -->\s*<a href="([^"]+)" class="article-list-item">[\s\S]*?<\/a>/g;

let match;
let toDeleteFiles = [];
let newArticlesContent = articlesContent;

while ((match = articleBlockRegex.exec(articlesContent)) !== null) {
    const block = match[0];
    const filename = match[1];
    
    // Check if block contains any of the keywords
    let shouldDelete = keywords.some(kw => block.includes(kw));
    
    // Sometimes the keyword is in the filename due to URL encoding
    if (!shouldDelete) {
        const decodedFilename = decodeURIComponent(filename);
        shouldDelete = keywords.some(kw => decodedFilename.includes(kw.replace(/\s+/g, '')));
    }

    if (shouldDelete) {
        newArticlesContent = newArticlesContent.replace(block, '');
        toDeleteFiles.push(filename);
        console.log(`Matched for deletion: ${filename}`);
    }
}

if (articlesContent !== newArticlesContent) {
    fs.writeFileSync(articlesHtmlPath, newArticlesContent.replace(/\n\s*\n\s*\n/g, '\n\n'), 'utf8');
    console.log(`Removed ${toDeleteFiles.length} articles from articles.html`);
}

// 2. Delete from sitemap.xml
let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
let newSitemapContent = sitemapContent;

toDeleteFiles.forEach(filename => {
    // Find <url> block containing the filename
    // The filename might be url encoded in sitemap
    const encodedFilename = encodeURI(filename);
    const regex = new RegExp(`<url>\\s*<loc>[^<]*?${escapeRegExp(encodedFilename)}<\\/loc>[\\s\\S]*?<\\/url>`, 'g');
    newSitemapContent = newSitemapContent.replace(regex, '');
});

if (sitemapContent !== newSitemapContent) {
    fs.writeFileSync(sitemapPath, newSitemapContent.replace(/\n\s*\n/g, '\n'), 'utf8');
    console.log(`Removed links from sitemap.xml`);
}

// 3. Delete the actual files
toDeleteFiles.forEach(filename => {
    // some hrefs might not have .html if stripped
    let actualFile = filename.endsWith('.html') ? filename : filename + '.html';
    const filePath = path.join(rootDir, actualFile);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${actualFile}`);
    } else {
        console.log(`File not found, skipping delete: ${actualFile}`);
    }
});

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
