const fs = require('fs');
const path = require('path');

// ================= 核心配置区 =================
// 1. 在这里填入你的 DeepSeek API Key (或任何兼容 OpenAI 格式的 API 接口)
const API_KEY = '在这里填入你的_API_Key'; 
const API_URL = 'https://api.deepseek.com/chat/completions'; // 根据需要可修改
// ==============================================

const BLOG_DIR = path.join(__dirname, '..'); // 指向 jichangxuanze.com博客 根目录

// 解析 HTML 获取标题的简易函数
function getTitleFromHtml(content) {
    const match = content.match(/<h1 class="article-title">(.*?)<\/h1>/);
    return match ? match[1] : '未命名文章';
}

async function generateArticleWithLLM(title, allLinks) {
    console.log(`\n🤖 正在为《${title}》动态生成 1000+ 字的高质量评测文章...`);
    
    // 随机挑选 5 篇作为内链候选建立“蜘蛛网”
    const shuffledLinks = allLinks.sort(() => 0.5 - Math.random());
    const selectedLinks = shuffledLinks.slice(0, 5);
    const linkMaterials = selectedLinks.map(l => `- <a href="${l.filename}">${l.title}</a>`).join('\n');

    const prompt = `
    你是一个顶级的谷歌 SEO 优化专家和专注翻墙节点、网络安全、机场评测的科技博主。
    请基于主题“${title}”撰写一篇不少于 1000 字的高质量原创长文。
    
    写作要求：
    1. 必须使用 HTML 格式输出（直接输出排版好的 HTML 标签，如 <h2>, <h3>, <p>, <strong>, <ul> 等，不要使用 markdown 代码块包裹，也不要有 ```html 开头）。
    2. 开头必须有一段吸引人的独立导语，紧密结合当前严峻的网络封锁形势或 AI 工具封号热点。
    3. 正文必须包含多级结构（H2、H3），并详细展开（不少于 1000 字），可以包含 IPLC 专线原理解析、测速数据模拟、纯净原生 IP 避免被封号的必要性等。
    4. 【核心指令 - SEO 蜘蛛网内链】：你必须在正文的自然段落中，不露痕迹地穿插以下文章的超链接代码（直接原样插入即可）：
    ${linkMaterials}
    5. 语气要求：专业、硬核的极客风格，具有极强的说服力，能够起到爆炸式的引流和转化效果。
    `;

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: 'deepseek-chat', // 视实际 API 决定
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7
        })
    });

    const data = await response.json();
    if (data.choices && data.choices[0]) {
        let content = data.choices[0].message.content;
        // 清理由于模型可能返回的 markdown 块标记
        content = content.replace(/```html/g, '').replace(/```/g, '').trim();
        return content;
    } else {
        throw new Error("API 响应异常: " + JSON.stringify(data));
    }
}

async function main() {
    if (API_KEY === '在这里填入你的_API_Key') {
        console.log("⚠️ 请先在脚本顶部填入你的 API Key！");
        return;
    }

    try {
        const files = fs.readdirSync(BLOG_DIR).filter(f => f.startsWith('blog-') && f.endsWith('.html'));
        console.log(`📂 在目录中找到 ${files.length} 篇博客文章。`);

        // 步骤 1: 构建全站蜘蛛网词库
        const allLinks = [];
        for (const file of files) {
            const filePath = path.join(BLOG_DIR, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const title = getTitleFromHtml(content);
            allLinks.push({ filename: file, title: title });
        }
        console.log(`🕸️ 蜘蛛网词库构建完毕，准备执行深度优化生成...`);

        // 步骤 2: 遍历文章执行防重复检测并生成
        for (const file of files) {
            const filePath = path.join(BLOG_DIR, file);
            let content = fs.readFileSync(filePath, 'utf8');
            
            // 防重复判断逻辑：检测是否已经拥有优化标识
            if (content.includes('<!-- SEO_OPTIMIZED -->')) {
                console.log(`⏭️ [跳过] ${file} 已经优化过，为防止重复生成，自动跳过。`);
                continue;
            }

            const title = getTitleFromHtml(content);
            
            // 排除自身的链接候选
            const candidateLinks = allLinks.filter(l => l.filename !== file);
            
            try {
                const optimizedAiContent = await generateArticleWithLLM(title, candidateLinks);
                
                // 将标记和新内容包裹起来
                const finalContentBlock = `\n<div class="ai-content">\n    <!-- SEO_OPTIMIZED -->\n${optimizedAiContent}\n</div>\n`;
                
                // 替换掉旧的 ai-content 区块
                const newHtml = content.replace(/<div class="ai-content">[\s\S]*?<\/div>/m, finalContentBlock);
                
                fs.writeFileSync(filePath, newHtml, 'utf8');
                console.log(`✅ [成功] 蜘蛛网长文已写入并更新：${file}`);
                
                // 为了防止 API 限频，可适当加个延迟
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (err) {
                console.error(`❌ [失败] 处理 ${file} 时遇到错误：`, err.message);
            }
        }
        
        console.log("\n🎉 所有任务处理完成！巨大的本地 SEO 蜘蛛网已经织成！");

    } catch (e) {
        console.error("\n❌ 程序运行出错:", e.message);
    }
}

main();
