const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, 'generate_static_articles.js');
let content = fs.readFileSync(jsPath, 'utf8');

if (!content.includes('autoInternalLink')) {
    const linkingLogic = `
// ====== SEO 全自动内链引擎 ======
function autoInternalLink(html) {
    let linkedHtml = html;
    
    // 内链词库配置：[关键词, 链接, 最大替换次数]
    const linkDict = [
        ['光速云', 'review-光速云.html', 2],
        ['唯兔云', 'review-唯兔云.html', 2],
        ['全球云', 'review-全球云.html', 2],
        ['机场推荐', 'ranking.html', 1],
        ['便宜机场', 'ranking.html#rank-31', 1],
        ['流媒体解锁', 'ranking.html', 1],
        ['原生 IP', 'article-native-ip.html', 1]
    ];

    linkDict.forEach(([keyword, url, maxReplace]) => {
        // 使用正则，排除已经在 <a> 标签内的词，避免嵌套替换破坏HTML结构
        // JS没有原生的后行断言在旧版本完美支持，但可以用更安全的替换逻辑
        const regex = new RegExp('(<a[^>]*>.*?</a>)|(' + keyword + ')', 'g');
        let count = 0;
        
        linkedHtml = linkedHtml.replace(regex, (match, p1, p2) => {
            // p1 匹配到了 <a> 标签包裹的内容，原样返回
            if (p1) return p1;
            // p2 匹配到了关键词
            if (p2 && count < maxReplace) {
                count++;
                return '<a href="' + encodeURI(url) + '" style="color: var(--color-primary); font-weight: bold; text-decoration: underline;" title="点击查看' + keyword + '深度评测">' + match + '</a>';
            }
            return match;
        });
    });

    return linkedHtml;
}
`;

    // 找到文章生成循环的位置，插入调用
    content = content.replace('articles.forEach(article => {', linkingLogic + '\narticles.forEach(article => {');
    content = content.replace('finalHtml = finalHtml.replace(/\\{\\{CONTENT\\}\\}/g, article.content);', 'finalHtml = finalHtml.replace(/\\{\\{CONTENT\\}\\}/g, autoInternalLink(article.content));');

    fs.writeFileSync(jsPath, content);
    console.log('Internal linking engine injected to generate_static_articles.js');
} else {
    console.log('Internal linking engine already exists.');
}
