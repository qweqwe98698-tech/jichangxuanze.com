const fs = require('fs');
const path = require('path');
const axios = require('axios');

// GitHub Secret 中的 Key
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 1. 获取当天 IT 科技圈的实时热点
async function fetchHotTrends() {
    try {
        const res = await axios.get('https://v2ex.com/api/topics/hot.json', { timeout: 5000 });
        if (res.data && res.data.length > 0) {
            return res.data.map(item => item.title).slice(0, 10).join('; ');
        }
    } catch(e) {
        console.error("⚠️ 获取 V2EX 热点失败，使用备用热点库...");
    }
    return "ChatGPT大规模封号风波, GitHub Copilot区域限制, 翻墙机场跑路潮, 严打违规跨境宽带, OpenAI最新模型发布, 国际网络出口线路大拥堵";
}

// 2. 利用 AI 结合热点，动态生成当天全新的爆款标题
async function generateDynamicTopics(trends, today, existingLinks) {
    const prompt = `
你是一个资深爆文 SEO 专家。今天是 ${today}。
当前全网最新科技热点有：【${trends}】。

请你结合上述热点，为我的“机场评测推荐”博客，构思 1 个极具爆款潜质、长尾词覆盖率高的文章标题。
这种“蹭热点”的文章极容易产生爆炸式的引流效果。
要求：
1. 巧妙地“蹭”上这些实时热点（比如：结合某 AI 封号聊原生 IP，结合大厂新闻聊跨境网络）。
2. 包含核心搜索词（如：机场评测、机场推荐、节点断流、翻墙、专线、IPLC、原生IP等）。
3. 【关键要求】：绝不能和过去已经写过的主题重复！过去写过的文章参考：\n${existingLinks.join('\n')}\n请确保新标题与上述文章截然不同，寻找全新的切入点。
4. 只输出合法的 JSON 数组，包含 1 个纯文本标题字符串，绝不要输出任何多余的解释、Markdown 代码块或标记。
示例格式：["标题1"]
`;
    try {
        const response = await axios.post('https://api.deepseek.com/chat/completions', {
            model: 'deepseek-chat',
            messages: [{ role: 'user', content: prompt }]
        }, {
            headers: { 'Authorization': `Bearer ${DEEPSEEK_API_KEY}`, 'Content-Type': 'application/json' }
        });
        
        let content = response.data.choices[0].message.content.trim();
        const match = content.match(/\[[\s\S]*\]/);
        if (match) {
            return JSON.parse(match[0]);
        }
        return JSON.parse(content);
    } catch (error) {
        console.error("❌ 动态生成话题失败:", error.message);
        return [];
    }
}

// 3. 获取已有文章列表，用于构建 SEO 蜘蛛网
function getExistingLinks() {
    const dir = path.join(__dirname, '..');
    const files = fs.readdirSync(dir);
    const links = [];
    files.forEach(f => {
        if ((f.startsWith('blog-') || f.startsWith('review-')) && f.endsWith('.html') && !f.includes('template')) {
            let readableName = f.replace('.html', '').replace('blog-', '博客: ').replace('review-', '机场评测: ');
            links.push(`文件路径="${f}", 主题="${readableName}"`);
        }
    });
    // 随机挑选 15 个作为上下文，让 AI 自然穿插
    return links.sort(() => 0.5 - Math.random()).slice(0, 15);
}

// IndexNow 强制秒收录推送
async function pushToIndexNow(urls) {
    try {
        await axios.post('https://api.indexnow.org/indexnow', {
            host: "jichangxuanze.com",
            key: "f8a4b2c1d9e7f5g6h3i0j1k2l4m5n6p7",
            keyLocation: "https://jichangxuanze.com/f8a4b2c1d9e7f5g6h3i0j1k2l4m5n6p7.txt",
            urlList: urls
        });
        console.log(`🚀 IndexNow 秒收录推送成功: ${urls.length} 个页面`);
    } catch (error) {
        console.error("❌ IndexNow 推送失败:", error.message);
    }
}

// 4. 生成带蜘蛛网内链的深度长文
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
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error(`❌ 获取文章《${topic}》失败:`, error.response ? error.response.data : error.message);
        return null;
    }
}

function updateSitemap(fileName, today) {
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
            console.log(`🗺️ 已注入 Sitemap: ${fileName}`);
        }
    }
}

function updateArticlesHtml(topic, fileName, today) {
    const articlesPath = path.join(__dirname, '..', 'articles.html');
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

    const templatePath = path.join(__dirname, '..', 'article-template.html');
    if (!fs.existsSync(templatePath)) {
        console.error("⚠️ 找不到 article-template.html！");
        return;
    }
    const templateHtml = fs.readFileSync(templatePath, 'utf8');
    const today = new Date().toISOString().split('T')[0];

    // 1. 获取今日全网热点，用于辅助 AI 蹭流量
    console.log(`📡 正在抓取全网最新热点...`);
    const todayTrends = await fetchHotTrends();
    console.log(`🔥 捕获今日全网热点: ${todayTrends}`);

    // 获取已有链接，用于防止重复话题和蜘蛛网内链
    const existingLinks = getExistingLinks();

    // 2. 动态生成 1 个全新的爆款标题
    console.log(`🧠 正在让 AI 结合热点思考今天的话题方向...`);
    let targetTopics = await generateDynamicTopics(todayTrends, today, existingLinks);
    
    if (!targetTopics || targetTopics.length === 0) {
        console.log("⚠️ AI 生成话题失败，本次放弃更新。");
        return;
    }
    console.log(`💡 AI 构思的话题库:`, targetTopics);

    // 3. 过滤重复文章，确保不发布重复内容
    const newTopicsToGenerate = targetTopics.filter(topic => {
        const safeName = topic.replace(/[^\w\u4e00-\u9fa5]/g, '');
        const outputPath = path.join(__dirname, '..', `blog-${safeName}.html`);
        return !fs.existsSync(outputPath);
    });

    if (newTopicsToGenerate.length === 0) {
        console.log("✅ AI 生成的话题与历史文章有重复，全部过滤，本次不更新。");
        return;
    }

    console.log(`🚀 开始撰写今日的 SEO 蜘蛛网爆款文章，共: ${newTopicsToGenerate.length} 篇`);

    for (const topic of newTopicsToGenerate) {
        const safeName = topic.replace(/[^\w\u4e00-\u9fa5]/g, '');
        const fileName = `blog-${safeName}.html`;
        const outputPath = path.join(__dirname, '..', fileName);

        console.log(`\n⏳ 正在撰写深度长文并织网:《${topic}》...`);
        const content = await generateBlogContent(topic, today, todayTrends, existingLinks);
        
        if (content) {
            let finalHtml = templateHtml.replace(/\{\{TITLE\}\}/g, topic);
            
            // 提取导语
            let descMatch = content.match(/<blockquote>([\s\S]*?)<\/blockquote>/);
            let metaDesc = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim().substring(0, 150) : `${topic} 深度解析文章，结合全网最新热点。`;
            finalHtml = finalHtml.replace(/\{\{DESCRIPTION\}\}/g, metaDesc);
            
            finalHtml = finalHtml.replace(/\{\{DATE\}\}/g, today);
            finalHtml = finalHtml.replace(/\{\{FILE_NAME\}\}/g, fileName);
            
            // 插入 AI 配图
            const encodedTopic = encodeURIComponent(topic + " cyberpunk technology network japanese anime manga style");
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
            
            // 立刻推送给搜索引擎秒收录
            await pushToIndexNow([`https://jichangxuanze.com/${encodeURI(fileName)}`]);
        }
        
        await sleep(3000); // 防封锁
    }

    console.log("\n🎉 今日自动博客任务（动态蜘蛛网版）完美完成！");
}

main();
