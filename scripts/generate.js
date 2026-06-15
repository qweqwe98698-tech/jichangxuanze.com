const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 从环境变量读取 GitHub Secrets 传进来的 Key
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// 待生成的机场列表（已扩充至全部 81 家）
const airports = [
    // TOP 5 阵营
    "光速云", "唯兔云", "全球云", "二猫云", "极连云", 
    // 顶级专线阵营
    "WgetCloud", "Nexitally", "AmyTelecom", "MESL", "BitzNet", "SkyLinX", "SpeedCAT", "Fastlink", "SSRDOG", "BoostNet", "Kuromis", "CyberGuard", "GLaDOS", "FlyingBird",
    // 极致性价比阵营
    "山水云", "星岛梦", "u1s1", "飞猫云", "秒秒云", "大象网络", "悠兔机场", "鹿语云机场", "VikingLinks", "CoffeeCloud", "YepFast", "EIX", "SSID", "龙猫云机场", "游乐园", "次元链接", "青云梯", "Flashfox", "夜煞云", "贝贝云", "守候网络", "一云梯",
    // 老牌求稳阵营
    "光年梯", "FATCAT", "扬帆云", "Web3", "TNTCloud", "蓝帆云", "速云梯", "五树云机场", "飞天猪", "酷酷云机场", "YkkCloud", "尔湾云", "XFLTD", "小鸡快跑机场", "COCODUCK", "疾风云", "Riolu", "BigME", "小旋风机场", "飞机云", "NieRCloud", "奈云", "最萌的云", "蛋挞云",
    // 新晋潜力阵营
    "CATNET", "八戒机场", "Anyland", "老猫云机场", "Bridge", "魔戒机场", "Infiniport", "一枝红杏", "iNetS", "Naiu", "泡泡狗机场", "狗狗加速", "XXAI", "ASH", "OKANC", "银河云"
];

// 返利链接映射字典
const affiliateLinks = {
    '光速云': 'https://qwerty.gsyaff.com/#/?code=keqgvT5Y',
    '二猫云': 'https://01.2maoyunaff.cc/#/register?code=ap0f4ZNt'
};

// 休眠函数，防止触发 API 限流
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

async function generateReviewContent(airportName, today) {
    const prompt = `
你是一个在“科学上网”圈子内拥有 10 年经验的极客测评博主。当前日期是 ${today}。
请为名为“${airportName}”的翻墙机场写一篇约 1200-1500 字的深度评测文章。为了最大化 SEO 排名和 Affiliate 转化，你的文章必须极具真实感、专业性，并且看似经过了漫长严苛的真实测试。

输出格式要求：
1. 必须且仅输出 HTML 正文片段（不要输出 <html>、<body>、\`\`\`html 等任何包裹符号，直接输出内部的 HTML 元素）。
2. 遇到需要强调的痛点或卖点，必须使用 <strong> 标签。

文章内容必须严格按照以下结构并输出对应的 HTML：

<div class="tldr-box" style="background: #f8f9fa; padding: 20px; border-left: 4px solid var(--color-primary); margin-bottom: 30px; border-radius: 4px;">
  <h3 style="margin-top: 0;">⚡ 核心参数省流总结</h3>
  <ul>
    <li><strong>综合评分：</strong>（随机给出 8.5 到 9.8 之间的分数，带上一两句评价）</li>
    <li><strong>起步价格：</strong>（编造一个合理的预估价格，如 15元/月 起）</li>
    <li><strong>底层协议：</strong>（提及 Vless、Trojan、SS 等）</li>
    <li><strong>流媒体解锁：</strong>（说明 Netflix / ChatGPT 解锁情况）</li>
    <li><strong>一句话点评：</strong>（犀利地总结它的核心卖点）</li>
  </ul>
</div>

<h2>前言：${airportName} 到底是一家怎样的机场？</h2>
简述其背景，用黑话（如：落地机、入口机、BGP、深港专线、晚高峰被墙等）打造专业人设。必须在正文中自然地提及当前的评测日期（${today}）。

<h2>网络架构与晚高峰实测数据</h2>
使用 HTML 表格 <table> 展示模拟的测速数据。请注意：为了真实感，不要所有节点都是完美的！请包含 4-5 个节点，其中必须故意包含 1-2 个冷门节点（如印度或阿根廷）显示出“高延迟(200ms+)”或“轻微丢包”，而核心节点（香港/日本/新加坡）表现优异。包含节点地区、Ping延迟、丢包率、YouTube 跑分表现。

<h2>流媒体解锁测试 (Netflix / Disney+)</h2>
客观说明其是否具备原生 IP，能否秒开 4K，是否有 DNS 劫持等。提及在 ChatGPT、TikTok 养号时的纯净度表现。

<h2>套餐分析与竞品对比</h2>
说明为什么它值这个价，它的目标客群是谁。随机拿一家行业内知名的同类机场（比如 光速云、唯兔云 或 全球云）进行一次简短的“拉踩”或对比，例如“相比于 XX 云，${airportName} 的优势在于...”。

<h2>客观优缺点总结与避坑建议 (重点)</h2>
必须用 <ul> 列表列出 3 个真实的优点和 1-2 个“真实的业务级缺点”（比如客服回复慢、低价套餐屏蔽了某些节点、不支持微信支付、不支持退款等）。附上一句建议：“由于网络环境因人而异，强烈建议先买一个月抛套餐试水”。

<h2>${airportName} 常见问题解答 (FAQ)</h2>
（使用 <h3> 或加粗的 <p> 提问，段落回答，生成 3 个用户最关心的 SEO 长尾问题并做出解答，比如：它会跑路吗？晚高峰卡不卡？支持退款吗？）
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
        const content = await generateReviewContent(airport, today);
        
        if (content) {
            // 替换模板中的占位符
            let finalHtml = templateHtml.replace(/\{\{AIRPORT_NAME\}\}/g, airport);
            finalHtml = finalHtml.replace(/\{\{DATE\}\}/g, today);
            
            // 插入高级 AI 自动配图
            const encodedTopic = encodeURIComponent(airport + " cyberpunk technology network VPN router neon style width 1920 height 1080");
            const aiImageUrl = `https://image.pollinations.ai/prompt/${encodedTopic}`;
            const imageHtml = `
            <figure style="margin: 20px 0; text-align: center;">
                <img src="${aiImageUrl}" alt="${airport}" style="width: 100%; max-width: 800px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); display: block; margin: 0 auto;">
            </figure>\n`;
            
            finalHtml = finalHtml.replace(/\{\{CONTENT\}\}/g, imageHtml + content);
            
            // 植入返利链接
            const affLink = affiliateLinks[airport] || '#';
            finalHtml = finalHtml.replace(/\{\{AFF_LINK\}\}/g, affLink);
            
            fs.writeFileSync(outputPath, finalHtml);
            console.log(`✅ 成功生成: ${fileName}`);

            // 动态注入 sitemap.xml
            const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
            let newlyAddedUrl = `https://jichangxuanze.com/${encodeURI(fileName)}`;
            if (fs.existsSync(sitemapPath)) {
                let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
                const urlTag = `<loc>${newlyAddedUrl}</loc>`;
                if (!sitemapContent.includes(urlTag)) {
                    const newUrlEntry = `
    <url>
        <loc>${newlyAddedUrl}</loc>
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
            
            // 立刻推送给搜索引擎
            await pushToIndexNow([newlyAddedUrl]);
        }
        
        // 暂停 3 秒，避免请求过快被 DeepSeek API 封锁
        await sleep(3000);
    }

    console.log("\n🎉 所有生成任务完成！");
}

main();
