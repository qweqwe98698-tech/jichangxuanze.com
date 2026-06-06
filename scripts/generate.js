const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 从环境变量读取 GitHub Secrets 传进来的 Key
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// 待生成的机场列表 (这里只放了一小部分作为演示，您可以随时把 81 个全部加进去)
const airports = [
    "光速云", "唯兔云", "全球云", "二猫云", "极连云", 
    "光年梯", "山水云", "星岛梦", "u1s1", "飞猫云"
];

// 休眠函数，防止触发 API 限流
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateReviewContent(airportName) {
    const prompt = `
你是一个在“科学上网”圈子内拥有 10 年经验的极客测评博主。
请为名为“${airportName}”的翻墙机场写一篇约 800-1000 字的深度评测文章。为了最大化 SEO 排名和 Affiliate 转化，你的文章必须极具真实感、专业性，并且看似经过了漫长严苛的真实测试。

输出格式要求：
1. 必须且仅输出 HTML 正文片段（不要输出 <html>、<body>、\`\`\`html 等任何包裹符号，直接从 <h2> 开始）。
2. 遇到需要强调的痛点或卖点，必须使用 <strong> 标签。

文章内容必须严格包含以下 5 个结构块：
1. <h2>前言：${airportName} 到底是一家怎样的机场？</h2>
   简述其背景，用黑话（如：落地机、入口机、BGP、深港专线、晚高峰被墙等）打造专业人设。
2. <h2>网络架构与晚高峰实测数据</h2>
   使用 HTML 表格 <table> 展示模拟的测速数据（包含节点地区、Ping延迟、YouTube 跑分表现）。
3. <h2>流媒体解锁测试 (Netflix / Disney+)</h2>
   客观说明其是否具备原生 IP，能否秒开 4K，是否有 DNS 劫持等。
4. <h2>套餐分析与性价比</h2>
   说明为什么它值这个价，它的目标客群是谁（重度视频用户、外贸人还是偶尔翻墙者）。
5. <h2>客观优缺点总结与避坑建议 (重点)</h2>
   必须用 <ul> 列表列出 3 个真实的优点和 1 个无关痛痒的缺点（为了显得客观真实），并附上一句建议：“由于网络环境因人而异，强烈建议先买一个月抛套餐试水”。
`;

    try {
        const response = await axios.post('https://api.deepseek.com/chat/completions', {
            model: 'deepseek-chat',
            messages: [{ role: 'user', content: prompt }]
        }, {
            headers: {
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error(`❌ 获取 ${airportName} 评测内容失败:`, error.response ? error.response.data : error.message);
        return null;
    }
}

async function main() {
    if (!DEEPSEEK_API_KEY) {
        console.error("⚠️ 未检测到 DEEPSEEK_API_KEY，跳过生成步骤。请确保在 GitHub Secrets 中配置了该变量。");
        return;
    }

    const templatePath = path.join(__dirname, '..', 'review-template.html');
    if (!fs.existsSync(templatePath)) {
        console.error("⚠️ 找不到 review-template.html 模板文件！");
        return;
    }
    
    const templateHtml = fs.readFileSync(templatePath, 'utf8');
    const today = new Date().toISOString().split('T')[0];

    console.log(`🚀 开始批量生成机场评测文章，总计: ${airports.length} 个...`);

    for (const airport of airports) {
        // 生成纯净的中文文件名，去掉特殊符号
        const safeName = airport.replace(/[^\w\u4e00-\u9fa5]/g, '');
        const fileName = `review-${safeName}.html`;
        const outputPath = path.join(__dirname, '..', fileName);
        
        // 增量生成：如果文件已经存在，就不重新消耗 Token 生成了
        if (fs.existsSync(outputPath)) {
            console.log(`⏭️ 跳过 ${airport}，文件 ${fileName} 已存在。`);
            continue;
        }

        console.log(`\n⏳ 正在让 DeepSeek 撰写《${airport}》的评测...`);
        const content = await generateReviewContent(airport);
        
        if (content) {
            // 替换模板中的占位符
            let finalHtml = templateHtml.replace(/\{\{AIRPORT_NAME\}\}/g, airport);
            finalHtml = finalHtml.replace(/\{\{DATE\}\}/g, today);
            finalHtml = finalHtml.replace(/\{\{CONTENT\}\}/g, content);
            
            fs.writeFileSync(outputPath, finalHtml);
            console.log(`✅ 成功生成: ${fileName}`);

            // 动态注入 sitemap.xml
            const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
            if (fs.existsSync(sitemapPath)) {
                let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
                const urlTag = `<loc>https://jichangxuanze.com/${encodeURI(fileName)}</loc>`;
                if (!sitemapContent.includes(urlTag)) {
                    const newUrlEntry = `
    <url>
        <loc>https://jichangxuanze.com/${encodeURI(fileName)}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.80</priority>
    </url>
</urlset>`;
                    sitemapContent = sitemapContent.replace('</urlset>', newUrlEntry);
                    fs.writeFileSync(sitemapPath, sitemapContent);
                    console.log(`🗺️ 已将 ${fileName} 自动编入站点地图 Sitemap`);
                }
            }
        }
        
        // 暂停 3 秒，避免请求过快被 DeepSeek API 封锁
        await sleep(3000);
    }

    console.log("\n🎉 所有生成任务完成！");
}

main();
