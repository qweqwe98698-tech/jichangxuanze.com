const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
let rankingHtml = fs.readFileSync(path.join(rootDir, 'ranking.html'), 'utf8');

const feimaoyunCard = `
                <!-- Top 2 -->
                <div id="rank-2" class="top-card rank-2">
                    <div class="rank-badge silver">NO.2</div>
                    <div class="top-card-content">
                        <h3 class="airport-name">飞猫云</h3>
                        <p class="airport-desc">连接轻快、使用简单、节点切换灵活。完美覆盖热门地区，适合日常浏览、视频播放和轻量 AI 使用，是非常优秀的备用机场及新手首选机场。</p>
                        <div class="airport-tags">
                            <span class="tag">🟦 轻快体验</span><span class="tag">🟩 多平台支持</span><span class="tag">🟪 新手友好</span><span class="tag">🟧 流媒体</span><span class="tag">🟨 备用机场</span>
                        </div>
                    </div>
                    <div class="top-card-action">
                        <div class="price"><span>￥</span>17<span>/月起</span></div>
                        <div style="display:flex; flex-direction:column; gap:8px;">
                            <a href="https://fdr5454erdr.fvgttt.sbs/#/?code=6uq0Xe9y" target="_blank" class="btn btn-primary tool-btn" style="text-align:center; text-decoration:none;">获取特惠</a>
                            <a href="review-飞猫云.html" class="btn btn-outline" style="text-align:center;">查看深度评测</a>
                        </div>
                    </div>
                </div>
`;

// Only insert if it doesn't already have <h3 class="airport-name">飞猫云</h3>
if (!rankingHtml.includes('<h3 class="airport-name">飞猫云</h3>')) {
    const rank2Idx = rankingHtml.indexOf('<!-- Top 2 -->');
    if (rank2Idx !== -1) {
        const part1 = rankingHtml.substring(0, rank2Idx);
        let part2 = rankingHtml.substring(rank2Idx);

        for (let i = 85; i >= 2; i--) {
            part2 = part2.replace(new RegExp("<!-- Top " + i + " -->", 'g'), "<!-- Top " + (i+1) + " -->");
            part2 = part2.replace(new RegExp('id="rank-' + i + '"', 'g'), 'id="rank-' + (i+1) + '"');
            part2 = part2.replace(new RegExp('class="top-card rank-' + i + '"', 'g'), 'class="top-card rank-' + (i+1) + '"');
            part2 = part2.replace(new RegExp("NO\\." + i + "(?=\\s*<)", 'g'), "NO." + (i+1));
            part2 = part2.replace(new RegExp('href="#rank-' + i + '"', 'g'), 'href="#rank-' + (i+1) + '"');
            part2 = part2.replace(new RegExp(">\\s*.*?" + i + "\\.\\s*", 'g'), match => match.replace(i + ".", (i+1) + "."));
        }

        rankingHtml = part1 + feimaoyunCard + part2;
        
        const tocRank3Idx = rankingHtml.indexOf('<a href="#rank-3" class="toc-link">');
        if (tocRank3Idx !== -1) {
            const liStart = rankingHtml.lastIndexOf('<li', tocRank3Idx);
            const tocRank2 = '                        <li style="margin-bottom: 8px;"><a href="#rank-2" class="toc-link">🥈 2. 飞猫云</a></li>\n';
            rankingHtml = rankingHtml.substring(0, liStart) + tocRank2 + rankingHtml.substring(liStart);
        }
    }
    rankingHtml = rankingHtml.replace(/TOP 81/g, 'TOP 82');
    rankingHtml = rankingHtml.replace(/81 家机场中/g, '82 家机场中');
    
    fs.writeFileSync(path.join(rootDir, 'ranking.html'), rankingHtml);
    console.log('Inserted FeiMaoYun card into ranking.html');
} else {
    console.log('FeiMaoYun card already exists.');
}
