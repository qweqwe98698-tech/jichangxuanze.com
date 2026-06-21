const fs = require('fs');
const path = require('path');
const axios = require('axios');

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const topicsToRegenerate = [
    "AI时代挣到钱了吗？从二狗API低价模型聊到原生IP机场：2026年跨境玩家必备的节点断流解决方案与机场推荐",
    "为了省点API钱，我竟然靠翻墙机场的IPLC专线干翻了AI断流与米家空调App的延迟——兼论拼多多不做网贷的底层逻辑与2026年最稳原生IP机场推荐评测",
    "Vibe Coding两年赚不到钱？揭秘AirPods级原生IP机场，专线IPLC告别“断流焦虑”，用二狗API同款低价链路撬动跨境变现！"
];

function getExistingLinks() {
    const dir = path.join(__dirname);
    const files = fs.readdirSync(dir);
    const links = [];
    files.forEach(f => {
        if ((f.startsWith('blog-') || f.startsWith('review-')) && f.endsWith('.html') && !f.includes('template')) {
            let readableName = f.replace('.html', '').replace('blog-', '博客: ').replace('review-', '机场评测: ');
            links.push(`文件路径="${f}", 主题="${readableName}"`);
        }
    });
    return links.sort(() => 0.5 - Math.random()).slice(0, 15);
}

async function generateBlogContent(topic, today, trends, existingLinks) {
    const prompt = `
你是一个专业的“网络通信优化”、“翻墙科普”与“SEO优化”专家。当前时间是 ${today}。
今日的真实科技圈热点有：【${trends}】。

请你围绕核心主题：“${topic}” 编写一篇用于发布在独立站博客上的深度长文（不少于 2000 字）。
你必须在文章中自然地“蹭”一下今日热点，以制造流量爆款效果，提高时效性收录。

【核心要求：构建 SEO 蜘蛛网】
以下是网站内已经存在的其他文章链接池：
${existingLinks.join('\n')}
请你在正文中，当上下文提到相关机场或概念时，极其自然地插入 5 到 8 个内部链接，确保文章内部结成一张庞大紧密的 SEO 蜘蛛网。
链接的 HTML 格式必须是：<a href="这里填提供的文件路径">这里填自然融合在句子里的文字</a>。

【排版要求】：
1. **必须包含独立的导语（Meta Description 级别）**：在开头用一段约 100-150 字的话总结全文，请用 <blockquote> 标签包裹作为导语。导语中必须提及今天的日期（${today} 最新实测）。
2. **差异化正文与丰富专业知识**：正文内容必须不少于 2000 字！内容硬核、差异化，能解决用户实际痛点，适合 SEO 长期抓取。
3. **SEO 关键词穿插**：正文中合理穿插机场评测、推荐等相关关键词，并将重要的核心词加粗 <strong>。
4. **纯 HTML 输出**：只输出正文 HTML 片段（绝不要 <html><body> 等外壳），必须包含清晰的 <h2>、<h3> 标题结构。
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
        let content = response.data.choices[0].message.content.trim();
        content = content.replace(/^```html\s*/i, '').replace(/```$/i, '').trim();
        content = content.replace(/^```\s*/i, '').replace(/```$/i, '').trim();
        return content;
    } catch (error) {
        console.error(`❌ 获取文章《${topic}》失败:`, error.message);
        return null;
    }
}

function updateSitemap(fileName, today) {
    const sitemapPath = path.join(__dirname, 'sitemap.xml');
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
            console.log(`🗺️ 已注入 Sitemap: ${fileName}`);
        }
    }
}

function updateArticlesHtml(topic, fileName, today) {
    const articlesPath = path.join(__dirname, 'articles.html');
    if (fs.existsSync(articlesPath)) {
        let content = fs.readFileSync(articlesPath, 'utf8');
        
        const dateObj = new Date(today);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = dateObj.toLocaleString('en-US', { month: 'short' });

        const newArticleBlock = `
            <!-- 新生成的文章 -->
            <a href="${fileName}" class="article-list-item">
                <div class="article-date-box">
                    <span class="article-date-day">${day}</span>
                    <span class="article-date-month">${month}</span>
                </div>
                <div class="article-info">
                    <h2>${topic}</h2>
                    <p>由云端甄选 AI 引擎自动结合全网最新热点生成的深度长文。内含硬核原理解析、测速数据与防坑指南，点击阅读详情...</p>
                    <div class="article-tags">
                        <span>全网热点</span>
                        <span>硬核科普</span>
                    </div>
                </div>
            </a>
            `;
        
        if (content.includes('<div class="article-list">')) {
            content = content.replace('<div class="article-list">', '<div class="article-list">\n' + newArticleBlock);
            fs.writeFileSync(articlesPath, content);
            console.log(`📑 成功更新文章聚合页: articles.html`);
        }
    }
}

async function main() {
    if (!DEEPSEEK_API_KEY) {
        console.error("⚠️ 未检测到 DEEPSEEK_API_KEY。");
        return;
    }

    const templatePath = path.join(__dirname, 'article-template.html');
    const templateHtml = fs.readFileSync(templatePath, 'utf8');
    const today = new Date().toISOString().split('T')[0];
    const todayTrends = "ChatGPT大规模封号风波, GitHub Copilot区域限制, 翻墙机场跑路潮, 严打违规跨境宽带, OpenAI最新模型发布, 国际网络出口线路大拥堵";

    const existingLinks = getExistingLinks();

    for (const topic of topicsToRegenerate) {
        const safeName = topic.replace(/[^\w\u4e00-\u9fa5]/g, '').substring(0, 50);
        const fileName = `blog-${safeName}.html`;
        const outputPath = path.join(__dirname, fileName);

        console.log(`\n⏳ 正在撰写:《${topic}》...`);
        const content = await generateBlogContent(topic, today, todayTrends, existingLinks);
        
        if (content) {
            let finalHtml = templateHtml.replace(/\{\{TITLE\}\}/g, topic);
            
            let descMatch = content.match(/<blockquote>([\s\S]*?)<\/blockquote>/);
            let metaDesc = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim().substring(0, 150) : `${topic} 深度解析文章，结合全网最新热点。`;
            finalHtml = finalHtml.replace(/\{\{DESCRIPTION\}\}/g, metaDesc);
            
            finalHtml = finalHtml.replace(/\{\{DATE\}\}/g, today);
            finalHtml = finalHtml.replace(/\{\{FILE_NAME\}\}/g, fileName);
            
            const encodedTopic = encodeURIComponent(topic.substring(0, 20) + " network security proxy");
            const aiImageUrl = `https://image.pollinations.ai/prompt/${encodedTopic}?width=1920&height=1080&nologo=true`;
            const imageHtml = `
            <figure style="margin: 20px 0; text-align: center;">
                <img src="${aiImageUrl}" alt="${topic}" style="width: 100%; max-width: 800px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); display: block; margin: 0 auto;">
            </figure>\n`;
            
            finalHtml = finalHtml.replace(/\{\{CONTENT\}\}/g, imageHtml + content);
            
            fs.writeFileSync(outputPath, finalHtml);
            console.log(`✅ 成功保存: ${fileName}`);

            updateSitemap(fileName, today);
            updateArticlesHtml(topic, fileName, today);
        }
        await sleep(2000);
    }
}

main();
