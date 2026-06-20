const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\user\\OneDrive\\Desktop\\jichangxuanze.com博客';

const titleMapping = [
    ["房过户后记录，普通人2026顶级配置：翻墙机场IPLC专线+原生IP，应对Codex重置与网络审查", "2026顶级配置：翻墙机场IPLC专线原生IP应对网络审查"],
    ["小孩住院花费高感叹就业难：翻墙机场推荐低价原生IP，副业变现省下3w诉讼费", "低价原生IP翻墙机场推荐：助力跨境出海变现"],
    ["2026年了，精简Windows镜像和翻墙机场哪个更稳？专线IPLC节点防封防断流深度评测", "2026年稳定翻墙机场推荐：专线IPLC节点防封防断流深度评测"],
    ["阿里前高管空降山姆：跨境网络需求暴增？原生IP机场推荐，解决节点断流与诉讼费焦虑", "跨境网络需求暴增：原生IP机场推荐，解决节点断流焦虑"],
    ["2026年618福利！极客玩具免费领？翻墙机场专线IPLC节点推荐，告别Codex重置封号", "2026年618福利：翻墙机场专线IPLC节点推荐与防封号指南"],
    ["乙肝抗体归零要补打，我的翻墙机场连接也‘归零’了？从智谱翻车看超低延迟IPLC必要性", "翻墙节点连接频繁断流？看超低延迟IPLC机场的必要性"],
    ["SpaceX市值千亿，你的翻墙机场却连原生IP都保不住？迈从A7抽奖之余聊聊专线选择标准", "为什么你的机场连原生IP都保不住？聊聊专线选择标准"],
    ["股票‘万1免5’笑了，Claude写APP却因节点断流崩了？2026年最稳机场+智谱避坑指南", "节点断流导致AI应用崩溃？2026年最稳机场避坑指南"],
    ["从凯美瑞侃到翻墙：为什么懂车的人都选IPLC专线，避开闲鱼‘黑话’里的断流机场？", "避开劣质断流机场：为什么懂行的人都选IPLC专线？"],
    ["减重20斤血泪史：油车电摩通勤党必备的‘原生IP’机场推荐，避免codex封号悲剧！", "打工人必备原生IP机场推荐：避免AI工具封号悲剧！"],
    ["凯美瑞车主后悔没早知道的秘密：跨境网络连接如丝滑驾驶，智谱AI用户都在抢的专线机场推荐", "实现如丝滑般的跨境网络连接：AI用户首选的专线机场推荐"],
    ["SpaceX市值破万亿，你的跨境网络还卡在‘万1免5’的陷阱里？高端翻墙机场原生IP解析", "高端翻墙机场原生IP解析：告别跨境网络卡顿陷阱"],
    ["减重20斤后我才发现：稳定翻墙和健康饮食一样，需要避开‘低质’陷阱——IPLC专线机场推荐", "如何避开低质节点陷阱？稳定IPLC专线机场推荐"],
    ["从乙肝抗体归零到VPN节点断流：2026年必看的网络安全科普与原生IP机场测评", "从VPN节点断流谈起：2026年网络安全科普与原生IP机场测评"],
    ["Claude实战开发iOS APP却频频断流？2026翻墙机场专线IPLC推荐，彻底告别Codex充值失败！", "解决AI开发频频断流：2026翻墙机场专线IPLC推荐与充值指南"]
];

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    for (const [oldTitle, newTitle] of titleMapping) {
        if (content.includes(oldTitle)) {
            // Using split and join for global replacement of plain strings
            content = content.split(oldTitle).join(newTitle);
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Updated titles in: " + file);
    }
}
