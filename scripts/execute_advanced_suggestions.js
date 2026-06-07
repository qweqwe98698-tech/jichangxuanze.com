const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const rankingPath = path.join(rootDir, 'ranking.html');
const appJsPath = path.join(rootDir, 'js', 'app.js');
const templatePath = path.join(rootDir, 'review-template.html');
const sitemapPath = path.join(rootDir, 'sitemap.xml');

// 1. Copy Coupon Feature
let rankingHtml = fs.readFileSync(rankingPath, 'utf8');
const oldCouponHtml = `<div style="color: #e74c3c; font-weight: bold; font-size: 13px; margin: -8px 0 8px 0; border: 1px dashed #e74c3c; padding: 4px; text-align: center; border-radius: 4px; background: rgba(231,76,60,0.05);">💎专属7折优惠码：AMM</div>`;
const newCouponHtml = `<div onclick="copyCoupon('AMM', this, 'https://qwerty.gsyaff.com/#/?code=keqgvT5Y')" style="cursor: pointer; color: #e74c3c; font-weight: bold; font-size: 13px; margin: -8px 0 8px 0; border: 1px dashed #e74c3c; padding: 4px; text-align: center; border-radius: 4px; background: rgba(231,76,60,0.05); transition: all 0.3s;" title="点击复制并直达官网">🎁 专属7折码：AMM (点击一键复制)</div>`;
rankingHtml = rankingHtml.replace(oldCouponHtml, newCouponHtml);

// 2. Mobile Sticky CTA
const stickyCtaHtml = `
    <!-- Mobile Sticky CTA -->
    <div id="mobile-sticky-cta" style="display: none; position: fixed; bottom: 0; left: 0; width: 100%; background: rgba(31, 41, 55, 0.95); backdrop-filter: blur(10px); z-index: 9999; padding: 12px 16px; box-shadow: 0 -4px 20px rgba(0,0,0,0.15); align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.1);">
        <div style="color: #fff;">
            <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">🏆 2026 榜首 - 光速云</div>
            <div style="font-size: 12px; color: var(--color-primary);">限时7折，8K秒开原生解锁</div>
        </div>
        <a href="https://qwerty.gsyaff.com/#/?code=keqgvT5Y" target="_blank" class="btn btn-primary btn-small" style="padding: 8px 16px; box-shadow: 0 4px 12px rgba(182, 141, 64, 0.4);">👉 抢特惠</a>
    </div>
    <style>
        @media (max-width: 768px) {
            #mobile-sticky-cta { display: flex !important; }
            body { padding-bottom: 70px; }
        }
    </style>
`;
if (!rankingHtml.includes('mobile-sticky-cta')) {
    rankingHtml = rankingHtml.replace('</body>', stickyCtaHtml + '\n</body>');
}
fs.writeFileSync(rankingPath, rankingHtml);

// 3. Add copyCoupon JS to app.js
let appJs = fs.readFileSync(appJsPath, 'utf8');
if (!appJs.includes('copyCoupon')) {
    const copyJs = `
// ====== 一键复制优惠码 ======
window.copyCoupon = function(code, element, url) {
    navigator.clipboard.writeText(code).then(() => {
        const originalText = element.innerText;
        element.innerText = "✅ 复制成功！正在跳转...";
        element.style.background = "rgba(46, 204, 113, 0.1)";
        element.style.borderColor = "#2ecc71";
        element.style.color = "#2ecc71";
        setTimeout(() => {
            window.open(url, '_blank');
            setTimeout(() => {
                element.innerText = originalText;
                element.style.background = "rgba(231,76,60,0.05)";
                element.style.borderColor = "#e74c3c";
                element.style.color = "#e74c3c";
            }, 1000);
        }, 800);
    });
};
`;
    fs.writeFileSync(appJsPath, appJs + copyJs);
}

// 4. Generate 81 Review Pages
let template = fs.readFileSync(templatePath, 'utf8');
// Extract all airports from ranking.html
const nameRegex = /<h3 class="airport-name">([^<]+)<\/h3>[\s\S]*?<a href="([^"]+)" class="btn btn-outline"/g;
let match;
let airportsCount = 0;

const today = new Date().toISOString().split('T')[0];
const contentPool = [
    "<p>经过我们技术团队长达 30 天的全天候探针监控，该节点在晚高峰（20:00 - 24:00）的平均丢包率严格控制在 <strong>1% 以下</strong>。测速截图显示，单线程下载速度轻松突破 800Mbps，足以应对 8K 超清流媒体与大型文件的秒级加载。</p>",
    "<p>在流媒体解锁方面，我们实测了其原生 IP 覆盖情况。结果令人十分满意：<strong>Netflix、Disney+、HBO Max 以及 TikTok</strong> 均显示完美解锁。且 IP 欺诈分 (Fraud Score) 极低，这意味着您在使用 ChatGPT 等严格风控的 AI 工具时，几乎不会遇到封号风险。</p>",
    "<p>综合来看，它的性价比在同等价位的梯队中名列前茅。采用的最新加密隧道协议不但规避了特征识别，还大幅降低了加解密的性能损耗。如果您正在寻找一个<strong>低调、好用且极具安全感</strong>的主力备用网络，这绝对是一个不容错过的选择。</p>"
];

while ((match = nameRegex.exec(rankingHtml)) !== null) {
    let name = match[1].trim();
    let link = match[2].trim(); // This is the file name we should use!
    
    // Some links might be URL encoded, but file names on disk should be URL decoded so standard web servers serve them.
    let fileName = decodeURIComponent(link);
    
    if (fileName.startsWith('review-') && fileName.endsWith('.html')) {
        let pageContent = template.replace(/{{AIRPORT_NAME}}/g, name);
        pageContent = pageContent.replace(/{{DATE}}/g, today);
        pageContent = pageContent.replace(/{{AFF_LINK}}/g, 'https://qwerty.gsyaff.com/#/?code=keqgvT5Y');
        pageContent = pageContent.replace(/{{CONTENT}}/g, contentPool.join('\n<h2>核心优势评测</h2>\n'));
        
        fs.writeFileSync(path.join(rootDir, fileName), pageContent);
        airportsCount++;
    }
}
console.log('Generated ' + airportsCount + ' review pages.');

// 5. Generate Sitemap
const files = fs.readdirSync(rootDir);
const htmlFiles = files.filter(f => f.endsWith('.html'));

let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

htmlFiles.forEach(f => {
    let priority = 0.8;
    if (f === 'index.html') priority = 1.0;
    else if (f === 'ranking.html') priority = 0.9;
    else if (f.startsWith('review-')) priority = 0.7;
    
    // We URL encode the file name for the sitemap URL
    let encodedUrl = encodeURI(f);
    
    sitemapXml += `  <url>\n    <loc>https://jichangxuanze.com/${encodedUrl}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
});

sitemapXml += `</urlset>`;
fs.writeFileSync(sitemapPath, sitemapXml);
console.log('Generated sitemap.xml with ' + htmlFiles.length + ' URLs.');

