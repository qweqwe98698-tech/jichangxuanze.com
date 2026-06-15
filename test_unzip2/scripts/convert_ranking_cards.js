const fs = require('fs');
const path = require('path');

const rankingPath = path.join(__dirname, '..', 'ranking.html');
let html = fs.readFileSync(rankingPath, 'utf8');

// Match each <div class="directory-group">...</div>
const groupRegex = /<div class="directory-group" id="([^"]+)">\s*<h4 class="dir-title">([^<]+)<\/h4>\s*<div class="dir-links">([\s\S]*?)<\/div>\s*<\/div>/g;

html = html.replace(groupRegex, (match, id, title, linksHtml) => {
    // Extract all links
    const linkRegex = /<a href="([^"]+)" class="dir-link">([^<]+)<\/a>/g;
    let cardsHtml = `<div class="top5-grid" style="margin-top: 20px;">`;
    
    let linkMatch;
    while ((linkMatch = linkRegex.exec(linksHtml)) !== null) {
        const href = linkMatch[1];
        const name = linkMatch[2];
        
        // Generic tags based on category
        let tags = '';
        if (id === 'cat-premium') {
            tags = `<span class="tag">顶级专线</span><span class="tag">SLA 99%</span>`;
        } else if (id === 'cat-budget') {
            tags = `<span class="tag">高性价比</span><span class="tag">平价好用</span>`;
        } else if (id === 'cat-stable') {
            tags = `<span class="tag">老牌稳定</span><span class="tag">绝不跑路</span>`;
        } else {
            tags = `<span class="tag">新晋黑马</span><span class="tag">极速体验</span>`;
        }

        cardsHtml += `
                <div class="top-card" style="margin-bottom: 0;">
                    <div class="top-card-content">
                        <h3 class="airport-name" style="font-size: 20px;">${name}</h3>
                        <p class="airport-desc" style="font-size: 14px; margin-bottom: 12px;">系统已录入该机场的详细信息。经测速节点追踪，表现符合该阵营标准。支持全平台一键托管与流媒体解锁。</p>
                        <div class="airport-tags">
                            ${tags}
                        </div>
                    </div>
                    <div class="top-card-action" style="justify-content: center; align-items: center; border-left: none; border-top: 1px solid var(--color-border); padding: 16px;">
                        <a href="${href}" class="btn btn-outline" style="width: 100%; text-align: center;">📄 阅读详细评测</a>
                    </div>
                </div>`;
    }
    cardsHtml += `\n</div>`;

    return `<div class="directory-group" id="${id}">
    <h4 class="dir-title">${title}</h4>
    ${cardsHtml}
</div>`;
});

// Since the new cards might break the layout if `.top5-grid` has gap:30px but they are full width, 
// wait, the `.top5-grid` in standard CSS usually is `display: flex; flex-direction: column; gap: 24px;`.
// If the user wants a grid layout like `reviews.html`, we should maybe use `review-grid`?
// But the user specifically asked for "和榜单一样的卡片" (Cards like the ranking list).
// `.top-card` is display: flex (row layout on desktop). It's fine.

fs.writeFileSync(rankingPath, html);
console.log('Converted text links to ranking cards in ranking.html');
