const fs = require('fs');
const path = require('path');
const axios = require('axios');

// GitHub Secret 中的 Key
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const rootDir = path.join(__dirname, '..');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ================= 长尾词矩阵库 (10大类目) =================
const KEYWORD_MATRIX = {
    "机场推荐": ["高端专线机场推荐", "高性价比平价机场", "企业级原生IP机场推荐", "适合留学生的便宜机场", "外贸跨境电商专用稳定机场"],
    "机场评测": ["IPLC专线测速全记录", "晚高峰节点断流测试", "2026年机场真实评测体验", "解锁流媒体机场深度评测", "全网最强BGP机场评测"],
    "Clash教程": ["Clash Verge Rev 进阶配置", "Clash 绕过局域网与规则编写", "Clash TUN 虚拟网卡模式教程", "Clash 节点测速超时解决方法", "分流规则自定义设置指南"],
    "Shadowrocket": ["小火箭 Shadowrocket 全局去广告规则", "苹果小火箭如何添加订阅", "小火箭连不上解决排查方法", "Shadowrocket 开启 UDP 转发加速", "小火箭按国家地区分流设置"],
    "V2rayN_Windows": ["Windows V2rayN 核心更新教程", "V2rayN 开启局域网共享代理", "V2rayN 路由规则黑白名单设置", "解决 V2rayN 端口冲突无法上网", "电脑端最稳的翻墙客户端配置"],
    "AI工具访问": ["ChatGPT 封号防御指南", "Claude 3 区域限制绕过", "纯净原生 IP 解锁 ChatGPT", "防止 AI 账号降权的节点要求", "如何检测节点 IP 是否被 OpenAI 拉黑"],
    "流媒体解锁": ["Netflix 奈飞跨区解锁原理", "Disney+ 严格风控绕过", "Youtube 8K 秒开节点要求", "Hulu 与 HBO Max 解锁机场推荐", "流媒体原生解锁与 DNS 解锁的区别"],
    "协议线路": ["Vless 与 Trojan 协议晚高峰对比", "IEPL 与 IPLC 专线哪个更稳", "SSR 协议在 2026 年还能用吗", "XTLS 伪装防封锁技术解析", "BGP 中转与直连线路的区别"],
    "避坑防跑路": ["如何判断翻墙机场快跑路了", "低价年付机场的超售陷阱", "一元机场和万人骑节点的危害", "为什么便宜节点打游戏总是掉线", "识别假 IPLC 专线的实用技巧"],
    "品牌对比": ["高端机场哪家强横向对比", "WgetCloud 与 Nexitally 评测对比", "极客推荐的冷门小众机场对比", "性价比老牌机场实力对决", "按流量计费与包月不限时机场对比"]
};

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
    return "AI封号潮, TikTok跨境合规, 宽带出海审查加剧, 专线涨价, 开源大模型更新, Netflix严格风控";
}

// 2. 动态生成绝不重复的话题
async function generateDynamicTopics(trends, today, existingLinks) {
    const categories = Object.keys(KEYWORD_MATRIX);
    // 随机抽取 2 个类目
    const cat1 = categories[Math.floor(Math.random() * categories.length)];
    const cat2 = categories[Math.floor(Math.random() * categories.length)];
    const kw1 = KEYWORD_MATRIX[cat1][Math.floor(Math.random() * KEYWORD_MATRIX[cat1].length)];
    const kw2 = KEYWORD_MATRIX[cat2][Math.floor(Math.random() * KEYWORD_MATRIX[cat2].length)];

    const prompt = `
你是一个极度擅长搞搜索流量的 SEO 爆文专家。今天是 ${today}。
当前科技圈热点有：【${trends}】。

本次指派给你的核心长尾词是：“${kw1}” 和 “${kw2}”。
请结合热点和这两个核心词，构思 1 个极具吸引力的长篇博客标题。
要求：
1. 标题必须有极强的点击欲，解决用户的实际痛点。
2. 绝对不能和过去写过的主题重复！以下是过去写过的文章：\n${existingLinks.join('\n')}\n请确保新标题与这些截然不同。
3. 只输出合法的 JSON 数组，包含 1 个纯文本标题字符串，绝不要输出多余的解释或代码块。
示例：["这是一个结合了热点和长尾词的爆款标题"]
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

// 3. 获取已有文章列表，构建蜘蛛网
function getExistingLinks() {
    const files = fs.readdirSync(rootDir);
    const links = [];
    files.forEach(f => {
        if ((f.startsWith('blog-') || f.startsWith('review-')) && f.endsWith('.html') && !f.includes('template')) {
            let readableName = f.replace('.html', '').replace('blog-', '博客: ').replace('review-', '机场评测: ');
            links.push(`文件路径="${f}", 主题="${readableName}"`);
        }
    });
    return links;
}

// 4. 生成带庞大蜘蛛网内链的深度长文
async function generateBlogContent(topic, today, trends, existingLinksAll) {
    // 随机挑 15 篇作为强制内链
    const selectedLinks = existingLinksAll.sort(() => 0.5 - Math.random()).slice(0, 15);

    const prompt = `
你是一个顶尖的 SEO 优化专家和网络通信极客。今天是 ${today}。
今日热点：【${trends}】。

请你围绕核心主题：“${topic}” 编写一篇极具深度的原创测评/科普长文。

【严苛的质量要求】：
1. 字数要求：纯正文必须超过 1500 字！禁止说空话套话，必须包含详细的原理解析、具体案例、防坑指南等干货。
2. 独立导语：文章开头第一段必须用 <blockquote> 标签包裹作为导语，约 100-150 字，必须包含当天的日期（${today} 实测）和文章核心关键词。
3. 结构清晰：包含丰富的 <h2> 和 <h3> 标题分层，重要词汇用 <strong> 加粗。

【蜘蛛网内部链接建设 (核心任务)】：
你必须将下面这些文章的链接，极其自然、毫无违和感地编织（穿插）在你的正文段落中。
至少自然插入 6 - 8 个内链。不要生硬地在文末罗列，而是要融入句子，比如：“如果你对协议不了解，可以参考我们的 <a href="blog-vless-vs-trojan.html">Vless与Trojan对比解析</a>”。
可用内链池：
${selectedLinks.join('\n')}

【输出要求】：
只输出纯 HTML 代码片段，从 <blockquote> 导语开始，到最后的 <p> 结束。禁止输出 <html><body> 或 Markdown 标记（如 \`\`\`html ）。绝对原创，禁止抄袭。
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
        console.error(`❌ 获取文章内容失败:`, error.message);
        return null;
    }
}

// 5. 自动注入高级 SEO 标签 (等同于 auto_seo_optimizer)
function injectSEOTags(content, fileName, title, desc, today) {
    const domain = 'https://jichangxuanze.com';
    let tagsToInject = '\n    <!-- Auto SEO Tags -->\n';
    
    tagsToInject += `    <link rel="canonical" href="${domain}/${fileName}" />\n`;
    tagsToInject += `    <meta property="og:title" content="${title}" />\n`;
    tagsToInject += `    <meta property="og:description" content="${desc}" />\n`;
    tagsToInject += `    <meta property="og:url" content="${domain}/${fileName}" />\n`;
    tagsToInject += `    <meta property="og:type" content="article" />\n`;
    tagsToInject += `    <meta property="og:site_name" content="机场选择" />\n`;
    tagsToInject += `    <meta name="twitter:card" content="summary_large_image" />\n`;
    tagsToInject += `    <meta name="twitter:title" content="${title}" />\n`;
    tagsToInject += `    <meta name="twitter:description" content="${desc}" />\n`;
    
    let jsonld = `{
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${title}",
      "description": "${desc}",
      "author": {
        "@type": "Organization",
        "name": "机场选择"
      },
      "datePublished": "${today}"
    }`;
    tagsToInject += `    <script type="application/ld+json">\n    ${jsonld}\n    </script>\n`;

    return content.replace(/(<\/head>)/i, `${tagsToInject}$1`);
}

function updateSitemap(today) {
    const sitemapPath = path.join(rootDir, 'sitemap.xml');
    const domain = 'https://jichangxuanze.com';
    const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html') && !f.startsWith('bot_') && !f.startsWith('test_') && f !== 'ccbaohe_clone.html');
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    files.forEach(file => {
        let priority = '0.8';
        if (file === 'index.html' || file === 'index_new.html') priority = '1.0';
        if (file === 'ranking.html' || file === 'reviews.html' || file === 'free-id.html') priority = '0.9';
        sitemap += `  <url>\n    <loc>${domain}/${file}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
    });
    sitemap += `</urlset>`;
    fs.writeFileSync(sitemapPath, sitemap);
    console.log(`🗺️ Sitemap 重新生成完毕，包含 ${files.length} 个页面`);
}

function updateArticlesHtml(topic, fileName, today) {
    const articlesPath = path.join(rootDir, 'articles.html');
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
                    <p>由云端甄选 AI 引擎自动结合长尾词库生成的深度硬核评测，点击阅读详情...</p>
                    <div class="article-tags">
                        <span>每日一更</span>
                        <span>长尾干货</span>
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

// ================= 主执行引擎 =================
async function main() {
    if (!DEEPSEEK_API_KEY) {
        console.error("⚠️ 未检测到 DEEPSEEK_API_KEY。跳过运行。");
        return;
    }

    const templatePath = path.join(rootDir, 'article-template.html');
    const templateHtml = fs.readFileSync(templatePath, 'utf8');
    const today = new Date().toISOString().split('T')[0];

    console.log(`📡 正在抓取全网最新热点...`);
    const todayTrends = await fetchHotTrends();
    
    const existingLinks = getExistingLinks();

    console.log(`🧠 AI 正在从长尾词矩阵中挑选话题...`);
    let targetTopics = await generateDynamicTopics(todayTrends, today, existingLinks);
    
    if (!targetTopics || targetTopics.length === 0) {
        console.log("⚠️ AI 生成话题失败。");
        return;
    }
    
    const topic = targetTopics[0];
    // 从长尾词提取英文短链 (Slug)
    let safeName = topic.replace(/[^\w\u4e00-\u9fa5]/g, '').substring(0, 50);
    try {
        const slugPrompt = `请将以下文章标题翻译成极简英文SEO链接(Slug)，全小写，连字符分隔，极简核心词(4-8个单词)，不要多余解释：\n${topic}`;
        const slugResp = await axios.post('https://api.deepseek.com/chat/completions', {
            model: 'deepseek-chat',
            messages: [{ role: 'user', content: slugPrompt }]
        }, { headers: { 'Authorization': `Bearer ${DEEPSEEK_API_KEY}`, 'Content-Type': 'application/json' } });
        let slug = slugResp.data.choices[0].message.content.trim().toLowerCase();
        slug = slug.replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        if (slug) safeName = slug;
    } catch(e) { console.error("⚠️ 生成英文Slug失败，降级为默认格式"); }

    const fileName = `blog-${safeName}.html`;
    const outputPath = path.join(rootDir, fileName);

    if (fs.existsSync(outputPath)) {
        console.log(`✅ 该话题已存在 (${fileName})，本次放弃更新以防重复。`);
        return;
    }

    console.log(`\n⏳ 正在撰写 1500+ 字的深度长文并编织内链网:《${topic}》...`);
    const content = await generateBlogContent(topic, today, todayTrends, existingLinks);
    
    if (content) {
        let finalHtml = templateHtml.replace(/\{\{TITLE\}\}/g, topic);
        
        let descMatch = content.match(/<blockquote>([\s\S]*?)<\/blockquote>/);
        let metaDesc = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim().substring(0, 150) : `${topic} 深度长尾词覆盖解析文章。`;
        finalHtml = finalHtml.replace(/\{\{DESCRIPTION\}\}/g, metaDesc);
        
        finalHtml = finalHtml.replace(/\{\{DATE\}\}/g, today);
        finalHtml = finalHtml.replace(/\{\{FILE_NAME\}\}/g, fileName);
        
        const encodedTopic = encodeURIComponent(topic.substring(0, 20) + " network high tech style");
        const aiImageUrl = `https://image.pollinations.ai/prompt/${encodedTopic}?width=1920&height=1080&nologo=true`;
        const imageHtml = `
        <figure style="margin: 20px 0; text-align: center;">
            <img src="${aiImageUrl}" alt="${topic}" style="width: 100%; max-width: 800px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); display: block; margin: 0 auto;">
        </figure>\n`;
        
        finalHtml = finalHtml.replace(/\{\{CONTENT\}\}/g, imageHtml + content);
        
        // 自动注入高级 SEO 标签
        finalHtml = injectSEOTags(finalHtml, fileName, topic, metaDesc, today);
        
        fs.writeFileSync(outputPath, finalHtml);
        console.log(`✅ 成功保存纯原创、防重复深度长文: ${fileName}`);

        updateArticlesHtml(topic, fileName, today);
        updateSitemap(today);
        
        await pushToIndexNow([`https://jichangxuanze.com/${encodeURI(fileName)}`]);
        console.log("\n🎉 今日自动博客任务（长尾词矩阵 + SEO蜘蛛网高级版）完美完成！");
    }
}

main();
