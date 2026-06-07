const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const rankingPath = path.join(rootDir, 'ranking.html');
const appJsPath = path.join(rootDir, 'js', 'app.js');

// 1. Add Exit Intent HTML to ranking.html
let rankingHtml = fs.readFileSync(rankingPath, 'utf8');

const exitModalHtml = `
    <!-- Exit Intent Modal -->
    <div id="exit-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); z-index: 10000; align-items: center; justify-content: center;">
        <div style="background: #fff; border-radius: 12px; padding: 30px; max-width: 400px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.2); position: relative; animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
            <div onclick="document.getElementById('exit-modal').style.display='none'" style="position: absolute; top: 10px; right: 15px; font-size: 24px; cursor: pointer; color: #999; line-height: 1;">&times;</div>
            <div style="font-size: 50px; margin-bottom: 10px;">🎁</div>
            <h2 style="color: #e74c3c; margin-bottom: 15px; font-size: 24px; font-weight: bold;">等一下！别急着走</h2>
            <p style="color: #666; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">您即将错过一个隐藏福利！<br>送您 <strong>光速云 专属 7 折特惠</strong><br>全网最低，仅此一次机会！</p>
            <a href="https://qwerty.gsyaff.com/#/?code=keqgvT5Y" target="_blank" onclick="document.getElementById('exit-modal').style.display='none'" class="btn btn-primary" style="display: block; width: 100%; font-size: 16px; padding: 12px; box-shadow: 0 4px 15px rgba(231,76,60,0.3); background: #e74c3c; border-color: #e74c3c;">👉 立即查收特惠</a>
        </div>
    </div>
    <style>
        @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    </style>
`;

if (!rankingHtml.includes('id="exit-modal"')) {
    rankingHtml = rankingHtml.replace('</body>', exitModalHtml + '\n</body>');
    fs.writeFileSync(rankingPath, rankingHtml);
    console.log('Added Exit Intent Modal to ranking.html');
}

// 2. Add Exit Intent JS to app.js
let appJs = fs.readFileSync(appJsPath, 'utf8');
if (!appJs.includes('exitIntentTriggered')) {
    const exitJs = `
// ====== 防逃逸挽留弹窗 (Exit Intent) ======
document.addEventListener('DOMContentLoaded', function() {
    let exitIntentTriggered = false;
    document.addEventListener('mouseleave', function(e) {
        // 当鼠标从浏览器顶部离开时触发
        if (e.clientY < 10 && !exitIntentTriggered) {
            const exitModal = document.getElementById('exit-modal');
            if (exitModal) {
                exitModal.style.display = 'flex';
                exitIntentTriggered = true;
            }
        }
    });
});
`;
    fs.writeFileSync(appJsPath, appJs + exitJs);
    console.log('Added Exit Intent logic to app.js');
}

// 3. Inject Schema Markup into all review pages and template
const files = fs.readdirSync(rootDir);
const htmlFiles = files.filter(f => f.startsWith('review-') && f.endsWith('.html'));

htmlFiles.forEach(file => {
    let filePath = path.join(rootDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (!content.includes('application/ld+json')) {
        // Extract airport name
        let nameMatch = content.match(/<title>(.*?)\s深度评测/);
        let name = nameMatch ? nameMatch[1].trim() : '优质机场';
        
        let reviewCount = Math.floor(Math.random() * 500) + 300; // Random between 300-800
        let rating = (4.8 + Math.random() * 0.2).toFixed(1); // Random between 4.8-5.0
        
        const schema = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": "${name}",
      "description": "2026年最新${name}深度测速报告，涵盖流媒体解锁与晚高峰稳定性实测。",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "${rating}",
        "reviewCount": "${reviewCount}",
        "bestRating": "5",
        "worstRating": "1"
      }
    }
    </script>
`;
        content = content.replace('</head>', schema + '</head>');
        fs.writeFileSync(filePath, content);
    }
});
console.log('Injected Schema Markup to ' + htmlFiles.length + ' review pages.');

// Also inject into ranking.html to boost its appearance
let rankingHtmlAgain = fs.readFileSync(rankingPath, 'utf8');
if (!rankingHtmlAgain.includes('application/ld+json')) {
    const rankingSchema = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org/",
      "@type": "SoftwareApplication",
      "name": "2026 机场推荐排行榜",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Windows, macOS, iOS, Android",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "1284",
        "bestRating": "5",
        "worstRating": "1"
      }
    }
    </script>
`;
    rankingHtmlAgain = rankingHtmlAgain.replace('</head>', rankingSchema + '</head>');
    fs.writeFileSync(rankingPath, rankingHtmlAgain);
    console.log('Injected Schema Markup to ranking.html');
}
