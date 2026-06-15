const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// Add 飞猫云 to ranking.html
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
                        <div style="display:flex; flex-direction:column; gap:8px; margin-top:20px;">
                            <a href="https://fdr5454erdr.fvgttt.sbs/#/?code=6uq0Xe9y" target="_blank" class="btn btn-primary tool-btn" style="text-align:center; text-decoration:none;">官网注册</a>
                            <a href="review-飞猫云.html" class="btn btn-outline" style="text-align:center;">查看深度评测</a>
                        </div>
                    </div>
                </div>
`;

if (!rankingHtml.includes('飞猫云')) {
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
}

// Targeted replace for links
const linkUpdates = [
    { name: '唯兔云', newLink: 'https://wt03.fedttt.my/#/?code=xIutqOBA' },
    { name: '全球云', newLink: 'https://mn7jr.quanatt.my/#/?code=Ov2nvU9C' },
    { name: '极连云', newLink: 'https://dshjsd7sh.jilianat.my/#/?code=VM1rKGUu' }
];

linkUpdates.forEach(u => {
    // 1. Update rankingHtml
    // We look for <h3 class="airport-name">Name</h3> ... and the first link inside .top-card-action
    let regex = new RegExp(`(<h3 class="airport-name">${u.name}</h3>[\\s\\S]*?<div class="top-card-action">[\\s\\S]*?href=")([^"]+)(" target="_blank")`, 'i');
    rankingHtml = rankingHtml.replace(regex, `$1${u.newLink}$3`);

    // 2. Update their specific review pages
    const reviewPath = path.join(rootDir, `review-${u.name}.html`);
    if (fs.existsSync(reviewPath)) {
        let reviewHtml = fs.readFileSync(reviewPath, 'utf8');
        // Replace ONLY the button links in the review page.
        // Usually it's in `<a href="..." target="_blank" class="btn btn-primary"`
        let btnRegex = new RegExp(`(href=")([^"]+)(" target="_blank" class="btn btn-primary")`, 'ig');
        reviewHtml = reviewHtml.replace(btnRegex, `$1${u.newLink}$3`);
        fs.writeFileSync(reviewPath, reviewHtml);
    }
});

fs.writeFileSync(path.join(rootDir, 'ranking.html'), rankingHtml);
console.log('Updated ranking.html and review pages');

// Update js/app.js
const appJsPath = path.join(rootDir, 'js', 'app.js');
if (fs.existsSync(appJsPath)) {
    let appJsContent = fs.readFileSync(appJsPath, 'utf8');
    
    linkUpdates.forEach(u => {
        let regex = new RegExp(`('${u.name}':\\s*')([^']+)(')`);
        appJsContent = appJsContent.replace(regex, `$1${u.newLink}$3`);
    });

    if (!appJsContent.includes("'飞猫云':")) {
        appJsContent = appJsContent.replace("const affLinks = {", "const affLinks = {\n    '飞猫云': 'https://fdr5454erdr.fvgttt.sbs/#/?code=6uq0Xe9y',");
    }

    fs.writeFileSync(appJsPath, appJsContent);
    console.log('Updated js/app.js');
}

// Generate review-飞猫云.html
const template = fs.readFileSync(path.join(rootDir, 'review-template.html'), 'utf8');
const reviewContent = "<h2>飞猫云：品牌活泼，轻快体验的极致选择</h2>\n<p>在同质化严重的机场圈中，<strong>飞猫云</strong> 凭借其“连接轻快、使用简单、节点切换灵活”的核心特点迅速脱颖而出。对于大部分刚刚接触翻墙的新手来说，飞猫云不仅提供傻瓜式的全平台接入（支持 Clash Verge Rev、Shadowrocket、Stash、v2rayN、v2rayNG 等），还通过极具亲和力的界面和极快的响应速度，让你彻底告别断流焦虑。</p>\n\n<h3>功能特性概览</h3>\n<ul>\n    <li>⚡ <strong>速度表现</strong>：适合日常浏览、视频播放和轻量 AI 使用，8K 秒开无压力。</li>\n    <li>🌍 <strong>节点布局</strong>：覆盖亚太和欧美热门地区，满足常见访问需求。</li>\n    <li>🛡️ <strong>稳定保障</strong>：多节点可选，非常适合作为重度用户的备用机场。</li>\n    <li>📱 <strong>新手体验</strong>：支持多平台客户端，导入订阅方便，即使是小白也能在 3 分钟内配置完成。</li>\n</ul>\n\n<h3>官网套餐与价格</h3>\n<table style=\"width:100%; border-collapse: collapse; margin-top: 20px; font-size: 15px;\">\n    <thead>\n        <tr style=\"background: rgba(182, 141, 64, 0.1);\">\n            <th style=\"padding: 12px; border: 1px solid var(--color-border); text-align: left;\">套餐名称</th>\n            <th style=\"padding: 12px; border: 1px solid var(--color-border); text-align: left;\">价格</th>\n            <th style=\"padding: 12px; border: 1px solid var(--color-border); text-align: left;\">流量</th>\n            <th style=\"padding: 12px; border: 1px solid var(--color-border); text-align: left;\">特性</th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr>\n            <td style=\"padding: 12px; border: 1px solid var(--color-border);\">轻量版 年付</td>\n            <td style=\"padding: 12px; border: 1px solid var(--color-border);\">¥99 / 年</td>\n            <td style=\"padding: 12px; border: 1px solid var(--color-border);\">59GB / 月</td>\n            <td style=\"padding: 12px; border: 1px solid var(--color-border);\">轻度长期使用</td>\n        </tr>\n        <tr style=\"background: rgba(0,0,0,0.02);\">\n            <td style=\"padding: 12px; border: 1px solid var(--color-border);\">极速版</td>\n            <td style=\"padding: 12px; border: 1px solid var(--color-border);\">¥17 / 月</td>\n            <td style=\"padding: 12px; border: 1px solid var(--color-border);\">110GB / 月</td>\n            <td style=\"padding: 12px; border: 1px solid var(--color-border);\">入门体验套餐</td>\n        </tr>\n        <tr>\n            <td style=\"padding: 12px; border: 1px solid var(--color-border);\">流光版</td>\n            <td style=\"padding: 12px; border: 1px solid var(--color-border);\">¥34 / 月</td>\n            <td style=\"padding: 12px; border: 1px solid var(--color-border);\">220GB / 月</td>\n            <td style=\"padding: 12px; border: 1px solid var(--color-border);\">日常使用推荐</td>\n        </tr>\n        <tr style=\"background: rgba(0,0,0,0.02);\">\n            <td style=\"padding: 12px; border: 1px solid var(--color-border);\">量子版</td>\n            <td style=\"padding: 12px; border: 1px solid var(--color-border);\">¥68 / 月</td>\n            <td style=\"padding: 12px; border: 1px solid var(--color-border);\">450GB / 月</td>\n            <td style=\"padding: 12px; border: 1px solid var(--color-border);\">多设备和视频适合</td>\n        </tr>\n        <tr>\n            <td style=\"padding: 12px; border: 1px solid var(--color-border);\">无界版</td>\n            <td style=\"padding: 12px; border: 1px solid var(--color-border);\">¥130 / 月</td>\n            <td style=\"padding: 12px; border: 1px solid var(--color-border);\">900GB / 月</td>\n            <td style=\"padding: 12px; border: 1px solid var(--color-border);\">大流量自由使用</td>\n        </tr>\n        <tr style=\"background: rgba(0,0,0,0.02);\">\n            <td style=\"padding: 12px; border: 1px solid var(--color-border);\">不限时流量包</td>\n            <td style=\"padding: 12px; border: 1px solid var(--color-border);\">¥680</td>\n            <td style=\"padding: 12px; border: 1px solid var(--color-border);\">1000GB</td>\n            <td style=\"padding: 12px; border: 1px solid var(--color-border);\">备用流量更灵活</td>\n        </tr>\n    </tbody>\n</table>\n\n<h2>为什么选飞猫云？</h2>\n<p>和圈内主打大带宽的光速云相比，飞猫云的定位更加聚焦于<strong>体验感</strong>。它的节点响应极其轻快，无论是在手机上使用 Shadowrocket 刷 Twitter，还是在电脑上用 Clash Verge Rev 查阅资料，都不存在明显的延迟感。加上其超高性价比的“轻量版年付 99 元”套餐，飞猫云绝对是 2026 年最值得入手的“备用防失联神器”与“新手第一款机场”。</p>\n";

let reviewHtml = template.replace(/\{\{AIRPORT_NAME\}\}/g, '飞猫云');
reviewHtml = reviewHtml.replace(/\{\{AFF_LINK\}\}/g, 'https://fdr5454erdr.fvgttt.sbs/#/?code=6uq0Xe9y');
reviewHtml = reviewHtml.replace(/\{\{DATE\}\}/g, '2026-06-15');
reviewHtml = reviewHtml.replace(/\{\{CONTENT\}\}/g, reviewContent);

fs.writeFileSync(path.join(rootDir, 'review-飞猫云.html'), reviewHtml);
console.log('Created review-飞猫云.html');
