const fs = require('fs');
const path = require('path');

const rankingPath = path.join(__dirname, '..', 'ranking.html');
let html = fs.readFileSync(rankingPath, 'utf8');

// Clear out old id="rank-X" if any exist on the top-card div
html = html.replace(/<div id="rank-\d+" class="top-card([^"]*)"/g, '<div class="top-card$1"');

// Add ids to only the top-cards
let cardCounter = 1;
html = html.replace(/<div class="top-card( rank-\d+)?"/g, (match, suffix) => {
    // suffix might be ` rank-1` or undefined
    const finalSuffix = suffix || '';
    return `<div id="rank-${cardCounter++}" class="top-card${finalSuffix}"`;
});

// Update the sidebar
html = html.replace(/<li><a href="[^"]*" class="toc-link">🏆 TOP 1-10 推荐<\/a><\/li>/, '<li><a href="#rank-1" class="toc-link">🏆 TOP 1-10 推荐</a></li>');
html = html.replace(/<li><a href="[^"]*" class="toc-link">⚡ TOP 11-30 推荐<\/a><\/li>/, '<li><a href="#rank-11" class="toc-link">⚡ TOP 11-30 推荐</a></li>');
html = html.replace(/<li><a href="[^"]*" class="toc-link">💰 TOP 31-50 推荐<\/a><\/li>/, '<li><a href="#rank-31" class="toc-link">💰 TOP 31-50 推荐</a></li>');
html = html.replace(/<li><a href="[^"]*" class="toc-link">🛡️ TOP 51-70 推荐<\/a><\/li>/, '<li><a href="#rank-51" class="toc-link">🛡️ TOP 51-70 推荐</a></li>');
html = html.replace(/<li><a href="[^"]*" class="toc-link">🆕 TOP 71-81 推荐<\/a><\/li>/, '<li><a href="#rank-71" class="toc-link">🆕 TOP 71-81 推荐</a></li>');

if (!html.includes('scroll-behavior: smooth')) {
    html = html.replace('</head>', '    <style>html { scroll-behavior: smooth; }</style>\n</head>');
}

fs.writeFileSync(rankingPath, html);
console.log('Added anchor IDs and updated TOC in ranking.html correctly');
