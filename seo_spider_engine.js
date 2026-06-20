const fs = require('fs');

// ================= 核心配置区 =================
// 1. 在这里填入你的 DeepSeek API Key
const DEEPSEEK_API_KEY = '在这里填入你的_DeepSeek_Key'; 

// 2. 你的 Z-Blog 后台登录信息
const ZBLOG_API_URL = 'https://jichangpingce.club/zb_system/api.php';
const ZBLOG_USER = 'Yexiodi98K';
const ZBLOG_PASS = 'Yexiodi98KYexiodi98KYexiodi98K';
// ==============================================

async function getZBlogToken() {
    console.log("正在登录 Z-Blog 后台获取权限...");
    const res = await fetch(`${ZBLOG_API_URL}?mod=member&act=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username: ZBLOG_USER, password: ZBLOG_PASS })
    });
    const data = await res.json();
    if (data.code === 0 || data.code === 200) {
        return data.data.token;
    }
    throw new Error("登录失败: " + data.message);
}

async function getAllArticles(token) {
    console.log("正在获取全站文章列表，构建蜘蛛网词库...");
    const res = await fetch(`${ZBLOG_API_URL}?mod=post&act=list`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    return data.data.list || data.data;
}

async function rewriteWithDeepSeek(article, allArticles) {
    console.log(`\n🤖 正在请求 DeepSeek 重写文章: 《${article.Title}》`);
    
    // 构建蜘蛛网内链素材
    const linkMaterials = allArticles
        .filter(a => a.ID !== article.ID)
        .slice(0, 5) // 随机挑 5 篇作为内链候选
        .map(a => `- [${a.Title}](${a.Url})`)
        .join('\n');

    const prompt = `
    你是一个顶级的谷歌 SEO 优化专家和科技博主。
    请基于主题“${article.Title}”重新撰写一篇不少于 1000 字的高质量原创长文。
    
    写作要求：
    1. 必须使用 HTML 格式输出（直接输出排版好的 HTML 标签，如 <h2>, <p>, <strong> 等，不要使用 markdown 代码块包围）。
    2. 开头必须有一段吸引人的、蹭当下热点的独立导语。
    3. 正文必须包含多个层级的分段（H2、H3），并详细展开，包含参数对比、优缺点分析等。
    4. 【核心指令】：你必须在正文中自然地穿插以下文章的超链接（这就是蜘蛛网策略），链接请使用 <a href="链接">关键词</a> 的 HTML 格式：
    ${linkMaterials}
    5. 语气要像一个专业、硬核的评测极客。
    `;

    const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7
        })
    });

    const data = await response.json();
    if (data.choices && data.choices[0]) {
        let content = data.choices[0].message.content;
        // 清理可能带有的 markdown 标记
        content = content.replace(/```html/g, '').replace(/```/g, '').trim();
        return content;
    } else {
        throw new Error("DeepSeek API 响应异常: " + JSON.stringify(data));
    }
}

async function updateArticle(token, id, title, newContent) {
    console.log(`🔄 正在将优化后的 1000+ 字内容更新回网站...`);
    const res = await fetch(`${ZBLOG_API_URL}?mod=post&act=post`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        // Z-Blog 接口更新文章时需要传 ID 和 Content
        body: new URLSearchParams({
            ID: id,
            Title: title,
            Content: newContent
        })
    });
    const data = await res.json();
    if (data.code === 0 || data.code === 200) {
        console.log(`✅ 文章《${title}》更新成功！`);
    } else {
        console.error(`❌ 更新失败:`, data.message);
    }
}

// 主干运行逻辑
async function main() {
    if (DEEPSEEK_API_KEY === '在这里填入你的_DeepSeek_Key') {
        console.log("⚠️ 请先在脚本顶部填入你的 DeepSeek API Key！");
        return;
    }

    try {
        const token = await getZBlogToken();
        const articles = await getAllArticles(token);
        
        console.log(`🕸️ 蜘蛛网词库构建完毕，共探测到 ${articles.length} 篇文章。`);
        
        // 为了安全演示，这里我们先只处理第一篇文章，你后续可以改成循环
        const targetArticle = articles[0]; 
        
        const optimizedContent = await rewriteWithDeepSeek(targetArticle, articles);
        await updateArticle(token, targetArticle.ID, targetArticle.Title, optimizedContent);
        
        console.log("\n🎉 单篇测试完成！去博客看看是不是变成 1000 字且充满内链的长文了！");
        console.log("（如果确认效果完美，你可以把脚本底部的限制去掉，让它一次性跑完 77 篇）");

    } catch (e) {
        console.error("\n❌ 程序出错:", e.message);
    }
}

main();
