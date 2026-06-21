const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const files = fs.readdirSync(rootDir);
const htmlFiles = files.filter(f => f.endsWith('.html') && !f.includes('template'));

console.log(`🔍 Found ${htmlFiles.length} HTML files. Building SEO Spider Web...`);

// 1. Collect all articles and their titles
const articleDB = [];

htmlFiles.forEach(file => {
    // Only target content pages for linking targets
    if (file.startsWith('blog-') || file.startsWith('review-') || file.startsWith('article-') || file === 'ranking.html') {
        const filePath = path.join(rootDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        let titleMatch = content.match(/<title>(.*?)<\/title>/);
        let h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
        let h2Match = content.match(/<h2[^>]*>(.*?)<\/h2>/);
        
        let title = '';
        if (titleMatch) title = titleMatch[1].replace(/\|.*/, '').trim();
        else if (h1Match) title = h1Match[1].replace(/<[^>]+>/g, '').trim();
        else if (h2Match) title = h2Match[1].replace(/<[^>]+>/g, '').trim();
        
        if (file === 'ranking.html') title = '机场推荐排行榜';
        
        if (title) {
            articleDB.push({ file, title, url: encodeURI(file) });
        }
    }
});

console.log(`📚 Extracted ${articleDB.length} article targets for internal linking.`);

// 2. Extract Keywords from titles for text replacement
const keywordDict = [];
articleDB.forEach(target => {
    // extract 2-4 char keywords from title, e.g. "Shadowsocks", "原生 IP", "流媒体解锁", "Vless", "Trojan"
    const words = target.title.split(/[\s：，！？、|（）()【】]/);
    words.forEach(w => {
        w = w.trim();
        if (w.length >= 2 && w.length <= 15 && !['怎么', '如何', '什么', '为什么', '推荐', '指南'].includes(w)) {
            keywordDict.push({ keyword: w, url: target.url, title: target.title });
        }
    });
});

// Sort by length descending to match longer keywords first
keywordDict.sort((a, b) => b.keyword.length - a.keyword.length);
// Remove duplicates
const uniqueKeywords = [];
const seenKeywords = new Set();
keywordDict.forEach(k => {
    if (!seenKeywords.has(k.keyword.toLowerCase())) {
        seenKeywords.add(k.keyword.toLowerCase());
        uniqueKeywords.push(k);
    }
});

// 3. Process each HTML file and inject links
let updatedCount = 0;

htmlFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    let originalHtml = html;
    
    // Only process content body to avoid messing up heads/navs
    // Also skip articles.html and other list pages to avoid nested <a> tags
    const isContentPage = file.startsWith('blog-') || file.startsWith('article-') || file.startsWith('review-') || file.startsWith('tool-');

    // Find the main content area. Assuming it's inside <div class="container">...
    
    // Function to replace keywords outside of HTML tags
    const replaceKeywords = (text, targetFile) => {
        let count = 0;
        let result = text;
        
        // We only want to inject maximum 3 links per page to avoid spam
        let maxLinks = 3;
        let linksAdded = 0;

        for (const target of uniqueKeywords) {
            if (linksAdded >= maxLinks) break;
            
            // Skip linking to itself
            if (target.url === encodeURI(targetFile)) continue;

            // Safe replace: not inside <a ...> or <h...> tags
            // Use regex to find keyword not preceded by <a or inside a tag
            const regex = new RegExp(`(<a[^>]*>.*?</a>|<[^>]+>)|(${target.keyword})`, 'g');
            
            let replaced = false;
            result = result.replace(regex, (match, p1, p2) => {
                if (p1) return p1; // inside a tag or is a tag, skip
                if (p2 && !replaced) {
                    replaced = true;
                    linksAdded++;
                    return `<a href="${target.url}" title="${target.title}" class="spider-link" style="color: var(--color-primary); font-weight: 500; text-decoration: underline; border-bottom: 1px dashed var(--color-primary); padding-bottom: 2px; transition: all 0.3s;">${match}</a>`;
                }
                return match;
            });
        }
        return result;
    };
    
    // Replace in paragraphs
    if (isContentPage) {
        html = html.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (match, p1) => {
            if (match.includes('class="page-desc"') || match.includes('由云端甄选 AI 引擎自动生成')) return match;
            const newP = replaceKeywords(p1, file);
            return match.replace(p1, newP);
        });
    }
    
    // Add "相关推荐" (Related Posts) at the bottom of articles
    if ((file.startsWith('blog-') || file.startsWith('article-') || file.startsWith('review-')) && !html.includes('id="seo-spider-related"')) {
        // Pick 4 random articles
        const related = [...articleDB]
            .filter(a => a.file !== file)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
            
        let relatedHtml = `
        <!-- SEO Spider Web Related Posts -->
        <div id="seo-spider-related" style="margin-top: 50px; padding-top: 30px; border-top: 1px solid var(--color-border);">
            <h3 style="font-size: 22px; color: var(--color-secondary); margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
                <span style="color: var(--color-primary);">🕸️</span> 延伸阅读
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
        `;
        
        related.forEach(r => {
            relatedHtml += `
                <a href="${r.url}" style="display: block; padding: 16px; background: rgba(0,0,0,0.02); border-radius: 8px; text-decoration: none; border: 1px solid transparent; transition: all 0.3s;" onmouseover="this.style.borderColor='var(--color-primary)'; this.style.background='var(--color-white)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';" onmouseout="this.style.borderColor='transparent'; this.style.background='rgba(0,0,0,0.02)'; this.style.boxShadow='none';">
                    <h4 style="font-size: 15px; color: var(--color-text); margin-bottom: 8px; line-height: 1.4;">${r.title}</h4>
                    <span style="font-size: 13px; color: var(--color-primary); font-weight: 500;">点击阅读 →</span>
                </a>
            `;
        });
        
        relatedHtml += `
            </div>
        </div>
        `;
        
        // Insert before </div>... </div> or footer
        if (html.includes('</article>')) {
             html = html.replace('</article>', relatedHtml + '\n</article>');
        } else {
             // fallback to insert before the last container div closing
             const footerIdx = html.indexOf('<footer');
             if (footerIdx !== -1) {
                 const insertIdx = html.lastIndexOf('</div>', footerIdx);
                 if (insertIdx !== -1) {
                     html = html.substring(0, insertIdx) + relatedHtml + '\n' + html.substring(insertIdx);
                 }
             }
        }
    }
    
    if (html !== originalHtml) {
        fs.writeFileSync(filePath, html);
        updatedCount++;
    }
});

console.log(`✅ SEO Spider Web built! Updated ${updatedCount} pages with deep internal links.`);
