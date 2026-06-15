const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'ranking.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Extract all airport names
const nameRegex = /<div id="rank-(\d+)"[\s\S]*?<h3 class="airport-name">([^<]+)<\/h3>/g;
let match;
let airports = [];
while ((match = nameRegex.exec(html)) !== null) {
    airports.push({ rank: parseInt(match[1]), name: match[2].trim() });
}

// Generate new TOC list
const emojis = ['⭐', '🔥', '🚀', '🌿', '🌟', '💎', '🐱', '⏱️', '🎖️', '👍', '💡', '⚡', '🎯', '👑', '🛡️', '✈️', '🎈', '🍉', '🍎', '🎮', '🎬', '🛸'];
let newToc = '<ul class="toc-list" style="max-height: 70vh; overflow-y: auto; padding-right: 10px;">\n';

airports.forEach(a => {
    let emoji = '';
    if (a.rank === 1) emoji = '🥇';
    else if (a.rank === 2) emoji = '🥈';
    else if (a.rank === 3) emoji = '🥉';
    else emoji = emojis[(a.rank - 4) % emojis.length];

    newToc += `                        <li style="margin-bottom: 8px;"><a href="#rank-${a.rank}" class="toc-link">${emoji} ${a.rank}. ${a.name}</a></li>\n`;
});
newToc += '                    </ul>';

// Replace the old toc-list
const startIdx = html.indexOf('<ul class="toc-list">');
const endIdx = html.indexOf('</ul>', startIdx) + 5;

if (startIdx !== -1 && endIdx !== -1 && airports.length > 0) {
    html = html.substring(0, startIdx) + newToc + html.substring(endIdx);
    fs.writeFileSync(htmlPath, html);
    console.log('Sidebar updated with ' + airports.length + ' airports.');
} else {
    console.log('Failed to parse or find toc-list');
}
