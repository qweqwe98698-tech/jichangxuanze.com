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

// 5. Generate Sitemap (Optimized)
const files = fs.readdirSync(rootDir);
// 过滤掉模板文件
const htmlFiles = files.filter(f => f.endsWith('.html') && !f.includes('template'));

let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

htmlFiles.forEach(f => {
    let priority = 0.8;
    let changefreq = 'weekly';
    
    if (f === 'index.html') {
        priority = 1.0;
        changefreq = 'daily';
    } else if (f === 'ranking.html' || f === 'reviews.html' || f === 'articles.html') {
        priority = 0.9;
        changefreq = 'daily';
    } else if (f.startsWith('review-')) {
        priority = 0.7;
        changefreq = 'monthly';
    } else if (f.startsWith('article-') || f.startsWith('blog-')) {
        priority = 0.8;
        changefreq = 'monthly';
    }
    
    // We URL encode the file name for the sitemap URL
    let encodedUrl = encodeURI(f);
    
    sitemapXml += `  <url>\n    <loc>https://jichangxuanze.com/${encodedUrl}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
});

sitemapXml += `</urlset>`;
fs.writeFileSync(sitemapPath, sitemapXml);
console.log('Optimized sitemap.xml generated with ' + htmlFiles.length + ' URLs.');


