const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '..', 'article-template.html');
const templateHtml = fs.readFileSync(templatePath, 'utf8');

const today = new Date().toISOString().split('T')[0];

const articles = [
    {
        title: "2026 年还能用 Shadowsocks 吗？主流翻墙协议大盘点",
        fileName: "article-shadowsocks-2026.html",
        desc: "随着防火墙的不断升级，曾经辉煌的 SS 协议是否真的已经彻底死亡？本文深度对比了 Vless、Trojan、Hysteria2 等新兴协议在晚高峰的抗干扰表现...",
        content: `
            <blockquote><strong>导语：</strong>在 2026 年的今天，GFW（防火长城）的封锁机制已经进化到了基于 AI 的深度包检测（DPI）与主动探测阶段。曾经的王者 Shadowsocks 是否还能再战？本文为您深度盘点当前主流翻墙协议的生存现状。</blockquote>
            
            <h2>1. Shadowsocks (SS) 的现状与末路</h2>
            <p>作为曾经最流行的轻量级代理协议，Shadowsocks 曾统治了翻墙圈数年之久。然而，在 2026 年的今天，普通的 SS 协议（如 aes-256-gcm）已经极易被 GFW 的特征识别引擎捕捉。<strong>结论很明确：纯 SS 协议已经不适合作为直连过墙的主力。</strong></p>
            <p>但 SS 真的死了吗？并没有。如今 SS 更多地作为<strong>专线机场（IEPL/IPLC）的内网传输协议</strong>。因为专线是不经过 GFW 的，在专线内使用 SS 协议，反而能最大化传输效率，降低加密解密带来的性能损耗。</p>

            <h2>2. Vless / Vmess：当下的中流砥柱</h2>
            <p>Vmess 曾是 V2ray 的核心，但其复杂的加密机制带来了较高的时间戳要求和性能开销。如今，<strong>Vless + XTLS/Reality</strong> 成为了绝对的主流。Reality 技术的出现，让节点可以完美伪装成访问正常的海外网站（如微软、苹果官网），极大地降低了被主动探测封禁 IP 的风险。</p>

            <h2>3. Trojan：以假乱真的 HTTPS 流量</h2>
            <p>Trojan 的核心思想是将代理流量伪装成正常的 HTTPS 网页浏览流量。只要你访问的是 443 端口，并且有合法的 TLS 证书，GFW 就很难将你与普通访问外网的用户区分开。目前 Trojan 依然非常坚挺，尤其是搭配真实建站的伪装环境。</p>

            <h2>4. Hysteria 2 / TUIC：暴力与极速的代名词</h2>
            <p>随着流媒体 4K/8K 需求的爆发，基于 UDP 的协议开始大放异彩。Hysteria 2 和 TUIC 采用了魔改的 QUIC 协议。它们的特点是“暴力发包”，无视轻微的网络丢包，在拥堵的晚高峰依然能跑满你的本地带宽。</p>
            <ul>
                <li><strong>优点：</strong>晚高峰速度极快，延迟极低。</li>
                <li><strong>缺点：</strong>可能被运营商针对性 QoS 限速，部分地区会对 UDP 流量进行无差别丢弃。</li>
            </ul>

            <h2>5. 总结建议</h2>
            <p>如果你购买的是<strong>直连机场</strong>，请务必选择支持 Vless-Reality 或 Hysteria 2 的节点。如果你购买的是<strong>全专线机场</strong>（如光速云、全球云），那么协议反而不那么重要了，SS 甚至能提供最丝滑的体验。</p>
        `
    },
    {
        title: "一文读懂：如何判断你的机场节点是否是“原生 IP”？",
        fileName: "article-native-ip.html",
        desc: "在注册 ChatGPT 或是运营 TikTok 时，非原生 IP 会直接导致封号警告。教你 3 种简单的方法，一键查出你所用节点的真实身份与 ISP 欺诈分...",
        content: `
            <blockquote><strong>导语：</strong>做跨境电商、运营 TikTok 或重度依赖 ChatGPT 的用户，最怕的就是因为节点 IP 不干净导致账号被无情封禁。2026 年，如何练就一双火眼金睛，一眼看穿“原生 IP”的真伪？本文教你三招。</blockquote>

            <h2>什么是“原生 IP”与“广播 IP”？</h2>
            <p>简单来说，<strong>原生 IP（Local IP）</strong> 就是 IP 地址的注册地和服务器实际物理机房所在地一致的 IP。这种 IP 通常由当地的 ISP（互联网服务提供商）直接分配，在各大流媒体平台和 AI 工具眼中，你就是一个“当地真实居民”。</p>
            <p>而<strong>广播 IP（Anycast / Non-native IP）</strong> 则是跨国公司将某个国家的 IP 段通过 BGP 路由广播到了另一个国家。这种 IP 在数据库中很容易被标记为“数据中心 IP（Hosting/Datacenter）”，极容易触发风控拦截。</p>

            <h2>方法一：使用 IP 欺诈分查询工具 (Scamalytics)</h2>
            <p>这是目前最硬核也是最直观的方法。你可以打开 <a href="https://scamalytics.com/ip" target="_blank">Scamalytics</a> 网站，输入你当前的节点 IP。系统会给出一个 Fraud Score（欺诈分数）：</p>
            <ul>
                <li><strong>0 - 15 分：</strong> 极度纯净，通常是优质家宽或原生 IP，随便注册 ChatGPT，TikTok 养号无压力。</li>
                <li><strong>16 - 50 分：</strong> 中等风险，能用，但偶尔会遇到谷歌验证码。</li>
                <li><strong>50 分以上：</strong> 高危 IP，万人骑的烂节点，登录任何平台都可能被秒封。</li>
            </ul>

            <h2>方法二：查询 IP 的 ASN 与 ISP 属性</h2>
            <p>打开 <code>https://bgp.he.net/</code> 查询你的 IP。如果在 ISP 栏显示的是诸如 <code>AT&T</code>, <code>Comcast</code>, <code>Chunghwa Telecom (中华电信)</code> 等知名民用宽带运营商，那么这通常是极品原生家宽 IP。如果显示的是 <code>DigitalOcean</code>, <code>Aliyun</code>, <code>Hetzner</code>，那这就是典型的数据中心机房 IP。</p>

            <h2>方法三：流媒体解锁实测法</h2>
            <p>用最简单的办法：连接节点后打开 Netflix。如果你能看到带有“TOP 10”标志的非自制剧，或者能顺利播放《绝命毒师》等受版权地区限制的剧集，说明这个 IP 被 Netflix 认可为当地原生 IP。</p>

            <h2>结语</h2>
            <p>如果你对原生 IP 有硬性需求（如 AI 开发、跨境外贸），建议直接购买明确标有“原生/家宽解锁”的专业机场（如全球云），可以省去大量试错与账号被封的成本。</p>
        `
    },
    {
        title: "震惊！那些“年付 9.9 元”的机场都是怎么赚钱的？",
        fileName: "article-cheap-airports.html",
        desc: "不要相信天上掉馅饼！深度揭秘黑心机场老板的运作逻辑：超售、月抛机、甚至盗取用户流量隐私。贪小便宜往往吃大亏...",
        content: `
            <blockquote><strong>导语：</strong>“年付 9.9，每月 1000G，晚高峰秒开 8K！”——相信你在电报群或贴吧里一定见过这样的广告。2026 年，带宽成本依然高昂，这些超低价机场到底是做慈善，还是暗藏杀机？本文为你揭秘黑产运作的底层逻辑。</blockquote>

            <h2>内幕一：“月抛机”与免费白嫖资源</h2>
            <p>绝大多数廉价机场根本没有购买稳定的服务器。他们利用各大云厂商（如 AWS、Azure、Google Cloud、Linode）的新用户注册试用金（如送 300 刀试用），批量生成虚拟信用卡进行注册。一个月试用期到了或者账号被风控封禁后，直接换下一个账号。</p>
            <p><strong>代价：</strong>用户的节点每隔几天就会大面积失效，必须频繁更新订阅。如果老板哪天搞不到新的白嫖号了，机场直接原地倒闭（俗称“跑路”）。</p>

            <h2>内幕二：无底线的极限“超售”</h2>
            <p>一台 1Gbps 带宽的服务器，正常只能容纳 100 个人流畅使用。但不良机场主会将它卖给 5000 个人。他们赌的就是“大家不会同时看视频”。</p>
            <p><strong>代价：</strong>白天测速可能还能跑到 50Mbps，一到晚上 8 点到 11 点的晚高峰，所有节点瞬间红牌，连 Google 首页都打不开，延迟飙升到 1000ms 以上。</p>

            <h2>内幕三：甚至你在帮他“赚钱” (暗刷与数据劫持)</h2>
            <p>最可怕的是部分缺乏底线的 0 元或 1 元机场。当你连接他们的节点时，你的所有 HTTP 流量都处于他们的监控之下：</p>
            <ul>
                <li><strong>流量劫持：</strong> 偷偷在网页中插入返利代码（如淘宝客、京东联盟），你买东西，他们拿抽成。</li>
                <li><strong>恶意肉鸡：</strong> 利用你的设备带宽作为其暗网爬虫体系的一部分。</li>
                <li><strong>贩卖信息：</strong> 收集用户的访问偏好和基础画像打包出售给黑灰产。</li>
            </ul>

            <h2>避坑建议</h2>
            <p>记住一个铁律：<strong>专线带宽的物理成本是透明的。</strong>比如深港 IEPL 专线，1Mbps 的月租成本在数十甚至上百元。那些售价低得离谱的，必然在某个你看不到的地方克扣了成本。强烈建议选择像“光速云”、“唯兔云”这样运营一年以上、定价合理的靠谱大厂，稳定才是最大的省钱。</p>
        `
    },
    {
        title: "流媒体解锁终极指南：为什么你的 Netflix 只能看自制剧？",
        fileName: "article-netflix.html",
        desc: "很多小白发现买了机场依然看不了某些版权剧集。这其实与 DNS 劫持和解锁机原理有关。本文教你如何彻底打破奈飞的版权封锁...",
        content: `
            <blockquote><strong>导语：</strong>“我已经连上新加坡节点了，为什么还是搜不到某部美剧？”这是许多刚接触科学上网的用户的共同疑问。2026 年，各大流媒体平台的风控墙越筑越高。一文带你弄懂流媒体解锁的底层原理。</blockquote>

            <h2>现象：什么是“只能看自制剧”？</h2>
            <p>当你打开 Netflix 时，如果你的 IP 被 Netflix 识别为代理（Proxy / VPN），Netflix 并不会直接封禁你的账号，而是会将你“打入冷宫”。在这个状态下，你只能看到 Netflix 自己拥有全球版权的“自制剧”（通常带有红色的 N 标志），而那些购买了地区版权的知名电影、动漫（如《老友记》、《进击的巨人》）将彻底从搜索库中消失。</p>

            <h2>底层原理：机场是如何进行“流媒体解锁”的？</h2>
            <p>Netflix 等平台的 IP 库非常庞大且实时更新，机场如果直接用落地机的 IP 去访问，分分钟就会被拉黑。因此，高端机场普遍采用了 <strong>DNS 劫持 + 解锁机 (DNS Unlocking)</strong> 的架构：</p>
            <ol>
                <li>当你访问 Netflix 的域名时，机场服务器的内部 DNS 会将这个请求拦截。</li>
                <li>它会将你的请求偷偷转发到一台极其珍贵、极其纯净的“原生 IP 解锁机”（这台机器可能带宽很小，但 IP 干净）。</li>
                <li>流媒体平台看到的是这台干净的解锁机，于是开放了所有版权库。</li>
                <li>由于视频数据流非常大，机场会将视频流流量再交回大带宽的主节点传输，只用解锁机做前置的“身份验证”。</li>
            </ol>

            <h2>常见故障与解决办法</h2>
            <p>如果你发现昨天还能看，今天又只能看自制剧了，通常是因为：</p>
            <ul>
                <li><strong>解锁机 IP 被 Netflix 封锁了：</strong> 这种情况很常见，需要等待机场老板手动更换新的解锁机 IP。优质机场通常会有自动化的 IP 轮换机制。</li>
                <li><strong>你的客户端 DNS 泄露了：</strong> 检查你的 Clash / V2ray 客户端，是否开启了全局模式，或者本地的 DNS 设置覆盖了代理规则。</li>
            </ul>

            <h2>终极建议</h2>
            <p>流媒体解锁是一项需要投入极高维护成本的工作。如果你是一个重度追剧党，请务必选择那些在官方频道承诺“全节点原生解锁”、“流媒体 SLA 保证”的顶级机场（如唯兔云），告别频繁换节点的烦恼。</p>
        `
    },
    {
        title: "Clash Verge Rev 进阶玩法：如何自己编写分流规则？",
        fileName: "article-clash-rules.html",
        desc: "不想所有的流量都走代理？通过编写简单的 Meta 规则集，让您的国内流量直连、国外流量代理，大幅降低节点流量消耗与延迟...",
        content: `
            <blockquote><strong>导语：</strong>用久了全局代理或者机场自带的规则，总觉得不够顺手？比如想让 GitHub 走日本节点，ChatGPT 走美国节点，国内淘宝走直连。今天我们以最新的 Clash Verge Rev（基于 Meta 内核）为例，教你玩转自定义分流规则。</blockquote>

            <h2>一、什么是分流规则 (Rule Providers)？</h2>
            <p>分流的核心逻辑就是“如果访问的域名/IP 匹配 A，就走 B 节点”。在 Clash Meta 内核中，我们通常不再把所有域名写死在配置文件里，而是通过引用的方式使用 <code>rule-providers</code>（规则提供者），这些规则集由开源社区实时维护（比如大名鼎鼎的 Loyalsoldier 或 ACL4SSR）。</p>

            <h2>二、在 Clash Verge Rev 中添加自定义规则</h2>
            <p>Clash Verge Rev 提供了一个非常强大的功能：<strong>Merge（合并规则）</strong>，也叫 Script / Profile 预处理。你不需要去修改机场下发的原始订阅文件（因为一更新就会被覆盖）。</p>
            
            <h3>步骤演示：让 OpenAI 强制走指定策略组</h3>
            <ol>
                <li>打开 Clash Verge Rev，进入左侧的“配置” (Profiles)。</li>
                <li>右键点击空白处，选择“新建” -> “Script” (预处理脚本)。</li>
                <li>输入以下 JavaScript 代码：</li>
            </ol>
<pre style="background:#1F2937; color:#E5E7EB; padding:15px; border-radius:8px; overflow-x:auto;"><code>function main(config) {
    // 在规则最前面插入自定义规则
    config.rules.unshift(
        "DOMAIN-SUFFIX,openai.com,美国节点策略组",
        "DOMAIN-SUFFIX,ai.com,美国节点策略组",
        "DOMAIN-KEYWORD,chatgpt,美国节点策略组"
    );
    return config;
}
</code></pre>
            <ol start="4">
                <li>保存并启用该预处理脚本。之后每次更新订阅，Clash 都会自动把这些规则添加到最前面！</li>
            </ol>

            <h2>三、高级玩法：GEOSITE 与 GEOIP</h2>
            <p>得益于 Meta 内核的强大，你现在可以直接使用基于数据库的匹配，一行代码搞定一类应用：</p>
            <ul>
                <li><code>GEOSITE,bilibili,DIRECT</code> （所有 B 站流量直连）</li>
                <li><code>GEOSITE,youtube,🚀 节点选择</code> （所有 YouTube 流量走代理）</li>
                <li><code>GEOIP,CN,DIRECT</code> （所有中国大陆 IP 直连，极为高效的最终防漏网规则）</li>
            </ul>

            <h2>结语</h2>
            <p>掌握了自定义规则，你的 Clash 才真正变成了一个强大的网络流量调度中心。赶快动手配置你的专属网络环境吧！</p>
        `
    }
];

let articlesHtmlContent = fs.readFileSync(path.join(__dirname, '..', 'articles.html'), 'utf8');


// ====== SEO 全自动内链引擎 ======
function autoInternalLink(html) {
    let linkedHtml = html;
    
    // 内链词库配置：[关键词, 链接, 最大替换次数]
    const linkDict = [
        ['光速云', 'review-光速云.html', 2],
        ['唯兔云', 'review-唯兔云.html', 2],
        ['全球云', 'review-全球云.html', 2],
        ['机场推荐', 'ranking.html', 1],
        ['便宜机场', 'ranking.html#rank-31', 1],
        ['流媒体解锁', 'ranking.html', 1],
        ['原生 IP', 'article-native-ip.html', 1]
    ];

    linkDict.forEach(([keyword, url, maxReplace]) => {
        // 使用正则，排除已经在 <a> 标签内的词，避免嵌套替换破坏HTML结构
        // JS没有原生的后行断言在旧版本完美支持，但可以用更安全的替换逻辑
        const regex = new RegExp('(<a[^>]*>.*?</a>)|(' + keyword + ')', 'g');
        let count = 0;
        
        linkedHtml = linkedHtml.replace(regex, (match, p1, p2) => {
            // p1 匹配到了 <a> 标签包裹的内容，原样返回
            if (p1) return p1;
            // p2 匹配到了关键词
            if (p2 && count < maxReplace) {
                count++;
                return '<a href="' + encodeURI(url) + '" style="color: var(--color-primary); font-weight: bold; text-decoration: underline;" title="点击查看' + keyword + '深度评测">' + match + '</a>';
            }
            return match;
        });
    });

    return linkedHtml;
}

articles.forEach(article => {
    // Generate individual HTML file
    let finalHtml = templateHtml.replace(/\{\{TITLE\}\}/g, article.title);
    finalHtml = finalHtml.replace(/\{\{DESCRIPTION\}\}/g, article.desc);
    finalHtml = finalHtml.replace(/\{\{DATE\}\}/g, today);
    finalHtml = finalHtml.replace(/\{\{FILE_NAME\}\}/g, article.fileName);
    finalHtml = finalHtml.replace(/\{\{CONTENT\}\}/g, autoInternalLink(article.content));
    
    fs.writeFileSync(path.join(__dirname, '..', article.fileName), finalHtml);
    console.log(`Generated: ${article.fileName}`);

    // Update the link in articles.html
    // Replace <a href="#" class="article-list-item"> to <a href="article-shadowsocks-2026.html" class="article-list-item"> but only for the specific article.
    // The structure in articles.html:
    // <a href="#" class="article-list-item">
    // ...
    // <h2>2026 年还能用 Shadowsocks 吗？主流翻墙协议大盘点</h2>
    
    // We can use regex to match the article block and replace the href.
    const escapedTitle = article.title.replace(/[.*+?^$\{}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(<a href=")#[^"]*(" class="article-list-item">[\\s\\S]*?<h2>${escapedTitle}<\/h2>)`, 'g');
    
    articlesHtmlContent = articlesHtmlContent.replace(regex, `$1${article.fileName}$2`);
});

fs.writeFileSync(path.join(__dirname, '..', 'articles.html'), articlesHtmlContent);
console.log('Updated articles.html with actual links.');
