const fs = require('fs');
const path = require('path');
const axios = require('axios');

// GitHub Secret 中的 Key
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// 极其丰富的 SEO 长尾词/干货话题库（可随时扩充）
const blogTopics = [
    "2026年翻墙软件推荐：还能用什么协议？",
    "IEPL与IPLC专线区别大揭秘，买机场必看",
    "机场跑路前兆有哪些？教你避开9.9包年的坑",
    "ChatGPT 封号太严重？如何判断节点是不是纯净原生 IP",
    "Netflix 流媒体解锁原理解析：为什么你的机场只能看自制剧？",
    "Vless 协议和 Trojan 哪个更适合晚高峰测速？",
    "Clash Verge Rev 进阶玩法：如何自己编写分流规则？",
    "如何用 iPhone 小火箭（Shadowrocket）实现全局去广告？",
    "玩外服游戏跳 Ping 怎么解决？电竞级机场选购指南",
    "TikTok 零播放量？你的节点 IP 欺诈分可能太高了",
    "机场老板不想让你知道的行业黑话：落地机、入口机是什么？",
    "为什么买了几十块的机场，油管 8K 还是卡？揭秘超售内幕",
    "Mac 用户必备代理工具：Surge 与 ClashX Pro 性能对比",
    "跨境电商独立站必备：高性价比静态住宅 IP 怎么选？",
    "安卓 v2rayNG 保姆级配置教程：一键导入与分流设置"
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟获取当天 IT 科技圈的实时热点（可通过真实的 RSSHub 或微博热搜 API 替换）
async function fetchHotTrends() {
    try {
        // 这里以一个模拟的网络请求架构代替，实际可以请求 v2ex/微博 热搜
        const res = await axios.get('https://v2ex.com/api/topics/hot.json', { timeout: 3000 });
        if (res.data && res.data.length > 0) {
            return res.data.map(item => item.title).slice(0, 5).join('; ');
        }
    } catch(e) {
        // 接口失败时的后备热门话题
    }
    return "ChatGPT大规模封号风波, GitHub Copilot区域限制, 翻墙机场跑路潮, 严打违规跨境宽带";
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

async function generateBlogContent(topic, today, trends) {
    const prompt = `
你是一个专业的“网络通信优化”、“翻墙科普”与“SEO优化”专家。当前时间是 ${today}。
今日的真实科技圈热点有：【${trends}】。

请你结合上述的“今日热点”，围绕核心主题：“${topic}” 编写一篇用于发布在独立站博客上的长文（不少于 1000 字）。
你必须在文章中自然地“蹭”一下这些热点（例如谈到某机场跑路、或者 ChatGPT 封号时引出你的分析）。

要求：
1. **必须包含独立的导语（Meta Description 级别）**：在文章开头用一段约 80-100 字的话总结全文，请用 <blockquote> 标签包裹作为导语。导语中必须自然地提及今天的日期（${today} 最新更新/实测），并提到一点今日的热点。
2. **丰富的专业知识**：内容必须硬核、专业，能解决用户实际痛点。比如提到具体的协议原理、防封号机制、或具体的解决步骤。
3. **SEO 关键词穿插**：在正文中自然地穿插相关关键词（如：晚高峰测速、专线机场、原生 IP、流媒体解锁、防跑路等），并将重要的关键词加粗 <strong>。
4. **输出纯 HTML**：只输出文章的正文 HTML 片段（不要 <html><body> 等外壳），必须包含清晰的 <h2>、<h3> 标题结构，重点内容用 <ul> 或 <ol> 列表。
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
        
        // 生成日期盒子，比如 06 Jun
        const dateObj = new Date(today);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = dateObj.toLocaleString('en-US', { month: 'short' });

        // 拼接 HTML 块
        const newArticleBlock = `
            <!-- 新生成的文章 -->
            <a href="${fileName}" class="article-list-item">
                <div class="article-date-box">
                    <span class="article-date-day">${day}</span>
                    <span class="article-date-month">${month}</span>
                </div>
                <div class="article-info">
                    <h2>${topic}</h2>
                    <p>由云端甄选 AI 引擎自动生成的深度科普长文。点击阅读详情，了解关于此话题的最新硬核解析与避坑指南...</p>
                    <div class="article-tags">
                        <span>极客科普</span>
                        <span>最新发布</span>
                    </div>
                </div>
            </a>
            `;
        
        // 插入到 <div class="article-list"> 的紧后面
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

    // 筛选出尚未生成的文章
    const unGeneratedTopics = blogTopics.filter(topic => {
        const safeName = topic.replace(/[^\w\u4e00-\u9fa5]/g, '');
        const outputPath = path.join(__dirname, '..', `blog-${safeName}.html`);
        return !fs.existsSync(outputPath);
    });

    if (unGeneratedTopics.length === 0) {
        console.log("✅ 所有储备话题均已生成完毕，无需更新。");
        return;
    }

    // 随机或者按顺序挑选 3 篇（这里直接取前 3 篇，因为每次都会过滤已生成的，所以相当于顺序发布）
    const targetTopics = unGeneratedTopics.slice(0, 3);
    console.log(`🚀 开始每日自动博客更新任务，今日发文量: ${targetTopics.length} 篇`);

    // 获取今日全网热点，用于辅助 AI 蹭流量
    const todayTrends = await fetchHotTrends();
    console.log(`🔥 捕获今日全网热点: ${todayTrends}`);

    for (const topic of targetTopics) {
        const safeName = topic.replace(/[^\w\u4e00-\u9fa5]/g, '');
        const fileName = `blog-${safeName}.html`;
        const outputPath = path.join(__dirname, '..', fileName);

        console.log(`\n⏳ 正在撰写博客:《${topic}》...`);
        const content = await generateBlogContent(topic, today, todayTrends);
        
        if (content) {
            let finalHtml = templateHtml.replace(/\{\{TITLE\}\}/g, topic);
            
            // 尝试提取 blockquote 中的导语作为 Meta Description
            let descMatch = content.match(/<blockquote>([\s\S]*?)<\/blockquote>/);
            let metaDesc = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim().substring(0, 150) : `${topic} 深度解析文章，云端甄选独家发布。`;
            finalHtml = finalHtml.replace(/\{\{DESCRIPTION\}\}/g, metaDesc);
            
            finalHtml = finalHtml.replace(/\{\{DATE\}\}/g, today);
            finalHtml = finalHtml.replace(/\{\{FILE_NAME\}\}/g, fileName);
            finalHtml = finalHtml.replace(/\{\{CONTENT\}\}/g, content);
            
            fs.writeFileSync(outputPath, finalHtml);
            console.log(`✅ 成功保存: ${fileName}`);

            updateSitemap(fileName, today);
            updateArticlesHtml(topic, fileName, today);
            
            // 立刻推送给搜索引擎秒收录
            await pushToIndexNow([`https://jichangxuanze.com/${encodeURI(fileName)}`]);
        }
        
        await sleep(3000); // 防封锁
    }

    console.log("\n🎉 今日自动博客任务完成！");
}

main();
