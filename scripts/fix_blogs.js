const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\user\\OneDrive\\Desktop\\jichangxuanze.com博客';

const mapping = {
    "blog-2026年618福利极客玩具免费领翻墙机场专线IPLC节点推荐告别Codex重置封号": "blog-2026年618福利翻墙机场专线IPLC节点推荐与防封号指南",
    "blog-2026年了精简Windows镜像和翻墙机场哪个更稳专线IPLC节点防封防断流深度评测": "blog-2026年稳定翻墙机场推荐专线IPLC节点防封防断流深度评测",
    "blog-Claude实战开发iOSAPP却频频断流2026翻墙机场专线IPLC推荐彻底告别Codex充值失败": "blog-解决AI开发频频断流2026翻墙机场专线IPLC推荐与充值指南",
    "blog-SpaceX市值千亿你的翻墙机场却连原生IP都保不住迈从A7抽奖之余聊聊专线选择标准": "blog-为什么你的机场连原生IP都保不住聊聊专线选择标准",
    "blog-SpaceX市值破万亿你的跨境网络还卡在万1免5的陷阱里高端翻墙机场原生IP解析": "blog-高端翻墙机场原生IP解析告别跨境网络卡顿陷阱",
    "blog-乙肝抗体归零要补打我的翻墙机场连接也归零了从智谱翻车看超低延迟IPLC必要性": "blog-翻墙节点连接频繁断流看超低延迟IPLC机场的必要性",
    "blog-从乙肝抗体归零到VPN节点断流2026年必看的网络安全科普与原生IP机场测评": "blog-从VPN节点断流谈起2026年网络安全科普与原生IP机场测评",
    "blog-从凯美瑞侃到翻墙为什么懂车的人都选IPLC专线避开闲鱼黑话里的断流机场": "blog-避开劣质断流机场为什么懂行的人都选IPLC专线",
    "blog-减重20斤后我才发现稳定翻墙和健康饮食一样需要避开低质陷阱IPLC专线机场推荐": "blog-如何避开低质节点陷阱稳定IPLC专线机场推荐",
    "blog-减重20斤血泪史油车电摩通勤党必备的原生IP机场推荐避免codex封号悲剧": "blog-打工人必备原生IP机场推荐避免AI工具封号悲剧",
    "blog-凯美瑞车主后悔没早知道的秘密跨境网络连接如丝滑驾驶智谱AI用户都在抢的专线机场推荐": "blog-实现如丝滑般的跨境网络连接AI用户首选的专线机场推荐",
    "blog-小孩住院花费高感叹就业难翻墙机场推荐低价原生IP副业变现省下3w诉讼费": "blog-低价原生IP翻墙机场推荐助力跨境出海变现",
    "blog-房过户后记录普通人2026顶级配置翻墙机场IPLC专线原生IP应对Codex重置与网络审查": "blog-2026顶级配置翻墙机场IPLC专线原生IP应对网络审查",
    "blog-股票万1免5笑了Claude写APP却因节点断流崩了2026年最稳机场智谱避坑指南": "blog-节点断流导致AI应用崩溃2026年最稳机场避坑指南",
    "blog-阿里前高管空降山姆跨境网络需求暴增原生IP机场推荐解决节点断流与诉讼费焦虑": "blog-跨境网络需求暴增原生IP机场推荐解决节点断流焦虑"
};

const genericContent = `
<div class="ai-content">
    <p>在2026年，寻找一款稳定、高速、防封锁的机场节点变得越来越重要。特别是对于经常需要访问海外网站、使用AI工具或者观看流媒体的用户来说，普通的节点经常会出现断流、卡顿甚至IP被封锁的问题。</p>
    <h2>为什么选择高质量的IPLC专线？</h2>
    <p>相比于传统的直连线路，IPLC/IEPL国际专线能够提供真正的超低延迟和无视GFW封锁的体验。专线网络不经过公共互联网拥堵路段，因此无论是在晚高峰还是在特殊敏感时期，都能保持丝滑般的连接。</p>
    <ul>
        <li><strong>超低延迟</strong>：保障日常网页浏览和视频秒开。</li>
        <li><strong>纯净原生IP</strong>：防止ChatGPT、Claude等AI工具封号，顺利解锁Netflix等流媒体。</li>
        <li><strong>极高稳定性</strong>：避免频繁断流，提升工作和娱乐效率。</li>
    </ul>
    <h2>2026年精选稳定机场推荐</h2>
    <p>为了帮助大家避坑，我们深入测试了市面上多款主流机场，总结出以下几款值得推荐的专线机场。这些机场在价格、速度、以及售后支持上都具有较高的性价比。</p>
    <p>对于预算有限的用户，可以参考我们整理的<a href="ranking">权威榜单</a>，选择最适合自己的套餐。</p>
    <h2>总结</h2>
    <p>不要在劣质节点上浪费时间与精力。选择一款优质的专线机场，不仅是对自己上网体验的升级，更是保护个人数据安全和账号防封的必要手段。希望本篇推荐能帮助您找到最匹配的跨境网络解决方案。</p>
</div>`;

const getTitle = (key) => key.replace(/^blog-/, '');

// Phase 1: Rename files and update their own content
for (const [oldKey, newKey] of Object.entries(mapping)) {
    const oldTitle = getTitle(oldKey);
    const newTitle = getTitle(newKey);
    
    const oldFile = path.join(dir, oldKey + '.html');
    const newFile = path.join(dir, newKey + '.html');
    
    if (fs.existsSync(oldFile)) {
        let content = fs.readFileSync(oldFile, 'utf8');
        
        // Replace inner content
        content = content.replace(/<div class="ai-content">[\s\S]*?<\/div>\s*<!--/m, genericContent + '\n            <!--');
        
        // Just in case the previous regex failed (e.g. no comment immediately after)
        if (!content.includes(genericContent)) {
            content = content.replace(/<div class="ai-content">[\s\S]*?<\/div>/m, genericContent);
        }

        // Replace Title tag and h1
        content = content.replace(new RegExp(oldTitle.replace(/[.*+?^$\/{}()|[\\]\\\\]/g, '\\\\$&'), 'g'), newTitle);
        // Also just replace the oldKey with newKey globally in this file (e.g., self references)
        content = content.replace(new RegExp(oldKey.replace(/[.*+?^$\/{}()|[\\]\\\\]/g, '\\\\$&'), 'g'), newKey);
        
        // Update Description meta tag
        content = content.replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + newTitle + ' - 深入评测2026年最优质的IPLC专线与原生IP机场，防止断流与封号。">');

        fs.writeFileSync(newFile, content, 'utf8');
        fs.unlinkSync(oldFile);
        console.log("Renamed and updated: " + oldKey + " -> " + newKey);
    } else {
        console.log("File not found: " + oldFile);
    }
}

// Phase 2: Update all other HTML files to point to the new keys and titles
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    for (const [oldKey, newKey] of Object.entries(mapping)) {
        const oldTitle = getTitle(oldKey);
        const newTitle = getTitle(newKey);

        if (content.includes(oldKey)) {
            content = content.replace(new RegExp(oldKey.replace(/[.*+?^$\/{}()|[\\]\\\\]/g, '\\\\$&'), 'g'), newKey);
            changed = true;
        }
        if (content.includes(oldTitle)) {
            content = content.replace(new RegExp(oldTitle.replace(/[.*+?^$\/{}()|[\\]\\\\]/g, '\\\\$&'), 'g'), newTitle);
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Updated links in: " + file);
    }
}
