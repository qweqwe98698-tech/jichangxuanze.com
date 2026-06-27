const fs = require('fs');
const path = require('path');
const axios = require('axios');

// GitHub Secret 或本地环境变量中的 Key
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const rootDir = path.join(__dirname, '..');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function optimizeArticle(file, content) {
    // 提取旧标题
    let oldTitle = '';
    const titleMatch = content.match(/<title[^>]*>(.*?)<\/title>/is);
    if (titleMatch && titleMatch[1]) {
        oldTitle = titleMatch[1].replace('- 机场选择', '').trim();
    }
    
    if (!oldTitle) {
        console.log(`⚠️ 跳过 ${file}，未找到 title 标签`);
        return null;
    }

    // 提取正文前 800 个字用于让 AI 理解文章主旨
    let bodyText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    let excerpt = bodyText.substring(0, 800);

    const isReview = file.startsWith('review-');
    
    const prompt = `
你是一个顶级的谷歌白帽 SEO 优化专家。
我现在有一篇已经存在的历史文章，它的原标题是：“${oldTitle}”。
文章内容节选如下：
"${excerpt}"

请根据这篇旧文章的内容，为它重新构思：
1. 【一个极具爆款潜质的新标题】：
要求：结合原意，融入高转化率的长尾词（比如：机场推荐、IPLC专线、测速评测、防跑路、原生IP、流媒体解锁等）。标题要长、要吸引点击。
2. 【一段 150 字左右的独立导语】：
要求：作为文章正文的开篇，必须密集包含长尾关键词，抛出痛点，吸引读者继续往下看。导语请以“今天是最新实测”或者“最近有很多粉丝问”等口吻开头。

请只输出一个 JSON 对象，绝对不要输出任何 markdown 代码块或多余解释。格式如下：
{
  "new_title": "这里是重新优化的新标题",
  "new_intro": "这里是写好的导语"
}
`;

    try {
        const response = await axios.post('https://api.deepseek.com/chat/completions', {
            model: 'deepseek-chat',
            messages: [{ role: 'user', content: prompt }]
        }, {
            headers: { 'Authorization': `Bearer ${DEEPSEEK_API_KEY}`, 'Content-Type': 'application/json' }
        });
        
        let aiContent = response.data.choices[0].message.content.trim();
        const match = aiContent.match(/\{[\s\S]*\}/);
        if (match) {
            aiContent = match[0];
        }
        return JSON.parse(aiContent);
    } catch (error) {
        console.error(`❌ 获取 ${file} 的 AI 优化内容失败:`, error.message);
        return null;
    }
}

function injectSEOTags(content, fileName, title, desc) {
    const domain = 'https://jichangxuanze.com';
    const today = new Date().toISOString().split('T')[0];
    
    // 先移除之前可能注入过的老旧 SEO 标签（如果存在），防止重复堆叠
    content = content.replace(/<!-- Auto SEO Tags -->[\s\S]*?(?=<\/head>)/i, '');
    
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
    
    let schemaType = fileName.startsWith('review-') ? 'Review' : 'Article';
    let jsonld = `{
      "@context": "https://schema.org",
      "@type": "${schemaType}",
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

async function main() {
    if (!DEEPSEEK_API_KEY) {
        console.error("⚠️ 未检测到 DEEPSEEK_API_KEY，请确保设置了环境变量。");
        return;
    }

    const files = fs.readdirSync(rootDir).filter(f => 
        (f.startsWith('blog-') || f.startsWith('review-')) && 
        f.endsWith('.html') && 
        !f.includes('template')
    );

    console.log(`📡 共检测到 ${files.length} 篇存量文章等待深度优化...\n`);

    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = path.join(rootDir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        console.log(`[${i+1}/${files.length}] 正在请 AI 给《${file}》做 SEO 手术...`);
        
        const optimizedData = await optimizeArticle(file, content);
        if (!optimizedData || !optimizedData.new_title || !optimizedData.new_intro) {
            console.log(`⚠️ 跳过 ${file}，AI 生成数据格式有误。`);
            await sleep(2000);
            continue;
        }

        let newTitle = optimizedData.new_title;
        let newIntroText = optimizedData.new_intro;
        
        // 1. 替换 <title>
        content = content.replace(/<title[^>]*>.*?<\/title>/is, `<title>${newTitle} - 机场选择</title>`);
        
        // 2. 替换 <meta description>
        if (content.match(/<meta\s+name=["']description["']/is)) {
            content = content.replace(/(<meta\s+name=["']description["']\s+content=["']).*?(["'])/is, `$1${newIntroText}$2`);
        } else {
            content = content.replace(/(<\/head>)/i, `    <meta name="description" content="${newIntroText}" />\n$1`);
        }

        // 3. 替换 <h1> (如果有)
        content = content.replace(/<h1[^>]*>.*?<\/h1>/is, `<h1>${newTitle}</h1>`);

        // 4. 替换或插入独立导语 <blockquote>
        const introHtml = `\n<blockquote>${newIntroText}</blockquote>\n`;
        // 如果原本就有 blockquote，大概率是旧的导语，直接替换
        if (content.match(/<blockquote>.*?<\/blockquote>/is)) {
            content = content.replace(/<blockquote>.*?<\/blockquote>/is, introHtml);
        } else {
            // 如果没有，就插在 </h1> 后面
            if (content.includes('</h1>')) {
                content = content.replace(/<\/h1>/i, `</h1>${introHtml}`);
            } else if (content.includes('<div class="article-content">')) {
                // 或者插在正文开头
                content = content.replace(/<div class="article-content">/i, `<div class="article-content">${introHtml}`);
            }
        }

        // 5. 更新高级 SEO 标签（OG, JSON-LD, Canonical 等）
        content = injectSEOTags(content, file, newTitle, newIntroText);

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ 优化成功: 标题变更为 "${newTitle}"`);
        successCount++;
        
        // 避免 API 限流
        await sleep(3000); 
    }

    console.log(`\n🎉 批量手术完毕！共成功重构了 ${successCount} 篇历史文章。这些文章现在全身长满长尾词和高级 SEO 标签了！`);
}

main();
