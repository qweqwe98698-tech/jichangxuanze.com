const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'ranking.html');
const jsPath = path.join(__dirname, '..', 'js', 'app.js');

let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Replace empty affiliate links with the default one
html = html.replace(/<a href="#" target="_blank" class="btn btn-primary tool-btn"/g, '<a href="https://qwerty.gsyaff.com/#/?code=keqgvT5Y" target="_blank" class="btn btn-primary tool-btn"');

// 2. Replace duplicate descriptions with unique fragments
const f1 = ["拥有独立核心自建机房，", "新一代协议架构加持，", "深耕跨境专属网络优化，", "精选全球顶级数据中心，", "采用最新隧道加密方案，", "配备企业级高可用线路，", "亚太专线直连技术优化，", "依托海外海量计算节点，", "专为解锁流媒体量身打造，", "主打极致高性价比与跑量，"];
const f2 = ["支持多路负载均衡，", "兼顾超低延迟与大带宽，", "提供海量纯净家宽IP，", "智能动态路由避开拥堵，", "晚高峰预留充足带宽冗余，", "全节点完美原生IP解锁，", "无缝接入所有主流海外应用，", "针对性降低游戏跨国延迟，", "自研内核保障特殊时期在线，", "全天候SLA智能监控网络，"];
const f3 = ["晚高峰4K秒开绝对不卡顿。", "解锁几乎所有的流媒体版权限制。", "非常适合外贸团队与油管重度用户。", "为极客玩家带来顺滑如丝的体验。", "在同档位段位中实测表现十分亮眼。", "支持全平台一键式傻瓜级托管。", "即使是敏感时期也能保证坚如磐石。", "为您的社媒与海外办公提供绝佳护航。", "可谓是低调好用、极度抗造的宝藏选择。", "不限速不绕路，小白直接入手的首选。"];

const targetDesc = "系统已录入该机场的详细信息。经测速节点追踪，表现符合该阵营标准。支持全平台一键托管与流媒体解锁。";

let usedCombos = new Set();
html = html.replace(new RegExp(targetDesc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), () => {
    let desc = "";
    while(true) {
        let p1 = f1[Math.floor(Math.random() * f1.length)];
        let p2 = f2[Math.floor(Math.random() * f2.length)];
        let p3 = f3[Math.floor(Math.random() * f3.length)];
        desc = p1 + p2 + p3;
        if(!usedCombos.has(desc)) {
            usedCombos.add(desc);
            break;
        }
    }
    return desc;
});

// 3. Add search box to sidebar
const searchHTML = `
                    <div style="padding: 0 10px 10px 10px;">
                        <input type="text" id="toc-search" placeholder="🔍 输入名字快速查找..." style="width: 100%; padding: 10px 12px; border: 1px solid var(--color-border); border-radius: 6px; font-size: 13px; outline: none; background: #fff; transition: all 0.3s;" onfocus="this.style.borderColor='var(--color-primary)'; this.style.boxShadow='0 0 0 3px rgba(182, 141, 64, 0.1)'" onblur="this.style.borderColor='var(--color-border)'; this.style.boxShadow='none'">
                    </div>`;

if (!html.includes('id="toc-search"')) {
    html = html.replace('<div class="toc-title">📑 机场快速导航</div>', '<div class="toc-title">📑 机场快速导航</div>' + searchHTML);
}

fs.writeFileSync(htmlPath, html);
console.log('ranking.html updated with aff links, unique descs, and search box.');

// 4. Add search logic to app.js
let jsCode = fs.readFileSync(jsPath, 'utf8');

if (!jsCode.includes('toc-search')) {
    const searchScript = `

// ====== 侧边栏搜索过滤 ======
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('toc-search');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const term = e.target.value.toLowerCase().trim();
            const links = document.querySelectorAll('.toc-list li');
            links.forEach(li => {
                const text = li.textContent.toLowerCase();
                if (text.includes(term)) {
                    li.style.display = '';
                } else {
                    li.style.display = 'none';
                }
            });
        });
    }
});
`;
    fs.writeFileSync(jsPath, jsCode + searchScript);
    console.log('app.js updated with search filter logic.');
}

