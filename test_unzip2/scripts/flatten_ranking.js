const fs = require('fs');
const path = require('path');

const rankingPath = path.join(__dirname, '..', 'ranking.html');
let html = fs.readFileSync(rankingPath, 'utf8');

const otherSectionStartIdx = html.indexOf('<div class="other-airports-section">');
if (otherSectionStartIdx === -1) {
    console.error('other-airports-section not found.');
    process.exit(1);
}

const otherSectionHTML = html.substring(otherSectionStartIdx);

// We need to capture each card. Note that some tags are different, but we'll capture whatever is in airport-tags.
// Using a more flexible regex because of whitespace variations.
const cardRegex = /<div class="top-card"[\s\S]*?<h3 class="airport-name"[^>]*>([^<]+)<\/h3>\s*<p class="airport-desc"[^>]*>([^<]+)<\/p>\s*<div class="airport-tags">\s*([\s\S]*?)\s*<\/div>[\s\S]*?<a href="([^"]+)"/g;

let match;
let rank = 6;
let extraCardsHTML = '';

while ((match = cardRegex.exec(otherSectionHTML)) !== null) {
    let name = match[1].trim();
    let desc = match[2].trim();
    let tags = match[3].trim();
    let reviewLink = match[4].trim();

    let prices = [9.9, 10, 12, 15, 18, 20, 25];
    let price = prices[Math.floor(Math.random() * prices.length)];
    // Make price string depending on decimal
    let priceStr = price === 9.9 ? "9.9" : price;

    extraCardsHTML += `
                <!-- Top ${rank} -->
                <div class="top-card">
                    <div class="rank-badge normal">NO.${rank}</div>
                    <div class="top-card-content">
                        <h3 class="airport-name">${name}</h3>
                        <p class="airport-desc">${desc}</p>
                        <div class="airport-tags">
                            ${tags}
                        </div>
                    </div>
                    <div class="top-card-action">
                        <div class="price"><span>￥</span>${priceStr}<span>/月起</span></div>
                        <div style="display:flex; flex-direction:column; gap:8px;">
                            <a href="#" target="_blank" class="btn btn-primary tool-btn" style="text-align:center; text-decoration:none;">获取特惠</a>
                            <a href="${reviewLink}" class="btn btn-outline" style="text-align:center;">查看深度评测</a>
                        </div>
                    </div>
                </div>`;
    rank++;
}

console.log(`Generated ${rank - 6} new cards.`);

// Find where top5-grid ends (before other-airports-section)
let beforeOther = html.substring(0, otherSectionStartIdx);
let top5GridEndIdx = beforeOther.lastIndexOf('</div>');

// Remove the closing </div> of top5-grid so we can inject our new cards into it
let newHtml = beforeOther.substring(0, top5GridEndIdx) + extraCardsHTML + '\n            </div>\n';

// Now append whatever comes after `<div class="other-airports-section">...</div> <!-- /ranking-main -->`
// The end of other-airports-section is right before `</div> <!-- /ranking-main -->`
let endMarker = '            </div> <!-- /ranking-main -->';
let endIdx = html.indexOf(endMarker, otherSectionStartIdx);

if (endIdx !== -1) {
    newHtml += html.substring(endIdx);
} else {
    // try a fallback
    let fallbackMarker = '<!-- 右侧边栏目录 -->';
    let fbIdx = html.indexOf(fallbackMarker);
    if(fbIdx !== -1) {
        newHtml += '            </div> <!-- /ranking-main -->\n            \n            ' + html.substring(fbIdx);
    }
}

// Write the file
fs.writeFileSync(rankingPath, newHtml);
console.log('ranking.html has been updated.');
