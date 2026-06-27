const fs = require('fs');
const path = require('path');
const axios = require('axios');

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const rootDir = path.join(__dirname, '..');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function hasChinese(str) {
    return /[\u4e00-\u9fa5]/.test(str);
}

async function getEnglishSlug(chineseName) {
    // 提取纯主题，去掉 'blog-' 或 'review-' 以及 '.html'
    let coreName = chineseName.replace(/^blog-/i, '').replace(/^review-/i, '').replace(/\.html$/i, '');
    
    const prompt = `
请将以下中文文章标题翻译成极简的英文 SEO 链接 (Slug) 格式。
原标题：${coreName}

要求：
1. 全小写英文，单词之间用连字符 "-" 分隔。
2. 剔除虚词，保留核心 SEO 关键词（如 airport, review, clash, proxy, vpn, iplc, native-ip, speed-test）。
3. 长度控制在 4 到 8 个单词以内，越精简越好。
4. 绝对只输出最终的英文字符串，不要输出任何多余的解释、引号或 Markdown。
示例：2026-best-iplc-airport-review
`;

    try {
        const response = await axios.post('https://api.deepseek.com/chat/completions', {
            model: 'deepseek-chat',
            messages: [{ role: 'user', content: prompt }]
        }, {
            headers: { 'Authorization': `Bearer ${DEEPSEEK_API_KEY}`, 'Content-Type': 'application/json' }
        });
        
        let slug = response.data.choices[0].message.content.trim().toLowerCase();
        slug = slug.replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        return slug;
    } catch (error) {
        console.error(`❌ 获取 ${chineseName} 的英文 Slug 失败:`, error.message);
        return null;
    }
}

async function main() {
    if (!DEEPSEEK_API_KEY) {
        console.error("⚠️ 未检测到 DEEPSEEK_API_KEY，请确保设置了环境变量。");
        return;
    }

    const allFiles = fs.readdirSync(rootDir);
    
    // 找出所有带中文的 blog 和 review 文件
    const targetFiles = allFiles.filter(f => 
        (f.startsWith('blog-') || f.startsWith('review-')) && 
        f.endsWith('.html') && 
        hasChinese(f)
    );

    console.log(`📡 共检测到 ${targetFiles.length} 篇包含中文的链接文件待重命名...\n`);

    let renameMap = {};

    // 1. 生成新文件名并重命名
    for (let i = 0; i < targetFiles.length; i++) {
        const oldFile = targetFiles[i];
        console.log(`[${i+1}/${targetFiles.length}] 正在翻译文件名: ${oldFile}`);
        
        const slug = await getEnglishSlug(oldFile);
        if (!slug) {
            console.log(`⚠️ 跳过 ${oldFile}，AI 返回为空。`);
            await sleep(2000);
            continue;
        }

        const prefix = oldFile.startsWith('review-') ? 'review-' : 'blog-';
        const newFile = `${prefix}${slug}.html`;

        if (fs.existsSync(path.join(rootDir, newFile))) {
             console.log(`⚠️ 目标文件 ${newFile} 已存在，稍作修改。`);
             renameMap[oldFile] = `${prefix}${slug}-${Math.floor(Math.random()*1000)}.html`;
        } else {
             renameMap[oldFile] = newFile;
        }
        
        // 物理重命名文件
        fs.renameSync(path.join(rootDir, oldFile), path.join(rootDir, renameMap[oldFile]));
        console.log(`✅ 重命名成功: ${oldFile} => ${renameMap[oldFile]}`);
        
        await sleep(2500); // 防限流
    }

    if (Object.keys(renameMap).length === 0) {
        console.log("没有文件被重命名，任务结束。");
        return;
    }

    console.log(`\n🕸️ 物理重命名完成。正在启动全站内链大清洗...`);

    // 2. 遍历所有相关文件，替换旧的中文链接为新的英文链接
    const filesToPatch = fs.readdirSync(rootDir).filter(f => 
        (f.endsWith('.html') || f.endsWith('.xml') || f.endsWith('.js')) && 
        !f.startsWith('.') && f !== 'node_modules'
    );

    let patchedCount = 0;

    filesToPatch.forEach(file => {
        const filePath = path.join(rootDir, file);
        if (fs.statSync(filePath).isDirectory()) return;

        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        // 遍历替换字典
        for (const [oldName, newName] of Object.entries(renameMap)) {
            // 全局替换纯文件名 (用 split/join 或者安全正则)
            // 考虑到可能有 url encode 过的中文链接在 sitemap 里
            const encodedOldName = encodeURI(oldName);
            
            content = content.split(oldName).join(newName);
            content = content.split(encodedOldName).join(newName);
        }

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            patchedCount++;
        }
    });

    console.log(`🎉 任务彻底完成！共重命名了 ${Object.keys(renameMap).length} 个文件，并顺藤摸瓜修复了全站 ${patchedCount} 个文件中的内链死链。`);
}

main();
