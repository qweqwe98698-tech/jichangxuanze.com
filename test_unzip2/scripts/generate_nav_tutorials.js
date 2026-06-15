const fs = require('fs');
const path = require('path');

const toolsData = {
    'chatgpt': {
        name: 'ChatGPT',
        shortDesc: 'OpenAI 的人工智能聊天机器人程序。',
        url: 'https://chatgpt.com/',
        highlights: '作为目前全球最强大的生成式 AI 之一，ChatGPT 提供极高水准的自然语言处理、代码生成、逻辑推理能力。无论是日常文档润色、多语言翻译，还是复杂的程序开发辅助，都能胜任。',
        guide: '注册需要原生海外 IP（推荐使用全球云或光速云的美国节点）。准备一个干净的海外邮箱（如 Gmail 或 Proton Mail），并通过海外手机接码平台完成验证即可注册成功。',
        advanced: '结合 Prompt Engineering（提示词工程），可以将其打造为私人助理。例如，使用角色设定法："你现在是一名拥有 10 年经验的资深架构师..."，能够获得更专业、有深度的回答。',
        warning: 'OpenAI 对 IP 的风控极为严格。切勿频繁切换不同国家的节点登录，否则极易触发账号封禁（封号提示：You do not have an account because it has been deleted）。'
    },
    'deepseek': {
        name: 'DeepSeek',
        shortDesc: '深度求索的人工智能大型语言模型。',
        url: 'https://chat.deepseek.com/',
        highlights: '国产之光，在代码生成和数学推理方面表现极为出色，部分能力甚至可以媲美顶级国际大模型。关键是，对中文语境理解更加透彻，且使用成本极低。',
        guide: '直接访问官网使用国内手机号即可轻松注册。没有严格的 IP 限制，国内直连也能获得相当不错的体验，但出海团队可以借助其极速的 API 进行跨境业务的本地化适配。',
        advanced: 'DeepSeek 的 API 价格极具竞争力，非常适合开发者接入自己的跨境电商客服系统，实现全自动的海外买家询盘回复。',
        warning: '虽然没有严格的节点限制，但在进行海外敏感数据抓取和分析时，建议配合海外服务器进行合规操作。'
    },
    'gemini': {
        name: 'Gemini',
        shortDesc: 'Google 的生成式人工智能聊天机器人。',
        url: 'https://gemini.google.com/',
        highlights: '背靠 Google 庞大的生态系统，与 Google Docs、Gmail、Drive 等生产力工具深度融合。具备极强的多模态能力（支持同时处理文本、图像、视频和音频）。',
        guide: '使用 Google 账号直接登录。如果提示“当前国家不可用”，请切换至欧美或日韩节点（推荐唯兔云的流媒体专线，IP 较干净）。',
        advanced: '可以在 Google Workspace 中直接唤醒 Gemini 帮助草拟海外商务邮件，或者总结海量的英文长篇行业报告，极大提升出海工作效率。',
        warning: 'Google 对异常流量检测较严，如果节点是被滥用的数据中心 IP，可能会频繁遇到人机验证（reCAPTCHA）。'
    },
    'grok': {
        name: 'Grok',
        shortDesc: 'xAI 的生成式人工智能聊天机器人。',
        url: 'https://grok.com/',
        highlights: '由埃隆·马斯克旗下的 xAI 开发，最大的特色是直接接入了 X（Twitter）的实时数据流，能够获取并分析全球最新发生的热点事件，且语气幽默、不受传统政治正确约束。',
        guide: '需拥有 X (Twitter) Premium 订阅账号才能体验完整版。注册和支付需要海外信用卡（如虚拟卡 Depay/Dupay）和干净的海外 IP 环境。',
        advanced: '对于出海社交媒体运营者来说，Grok 是分析 Twitter 实时趋势、挖掘爆款话题的终极武器，甚至能用于高频的海外舆情监控。',
        warning: '支付 Premium 订阅时请确保 IP 地址与账单地址一致，否则可能会被 Stripe 风控系统拦截。'
    },
    'claude': {
        name: 'Claude',
        shortDesc: 'Anthropic 的大型语言模型。',
        url: 'https://claude.ai/',
        highlights: '在长文本处理（支持 200K token 上下文）、文学创作、代码重构方面甚至超越了 ChatGPT。它的回答风格更细腻、自然，非常适合撰写长篇英文博客和出海 SEO 文章。',
        guide: '目前 Claude 仅对部分国家开放。注册时不仅需要欧美原生 IP，还需要极其干净的海外手机号接码，门槛较高。',
        advanced: '利用其超长上下文能力，可以直接将一整本数百页的英文操作手册扔给它，让它提取核心步骤并翻译为目标语言，出海本地化效率极高。',
        warning: 'Anthropic 的风控被誉为目前业界最严（玄学封号）。切记：只用固定节点（如全球云的独立 IP），不要用滥用的公共机场节点。'
    },
    'youtube': {
        name: 'YouTube',
        shortDesc: '全球最大的视频搜索和分享平台。',
        url: 'https://www.youtube.com/',
        highlights: '全球流量第二大的网站，出海品牌营销的必争之地。不论是长视频测评、短视频 (Shorts) 引流，还是直播带货，YouTube 都有着无法替代的转化率。',
        guide: '国内访问需使用科学上网工具。想要无广告体验并支持后台播放，可订阅 YouTube Premium（推荐使用阿根廷、土耳其或乌克兰节点进行低价区订阅）。',
        advanced: '跨境电商卖家可以通过 YouTube Studio 的数据分析，挖掘海外受众的观看留存率，并利用 Shorts 算法红利进行低成本高频曝光。',
        warning: '跨区订阅 Premium 时，如果被 Google 检测到支付 IP 与注册地不符，可能会被取消低价区资格，建议支付时使用原生节点。'
    },
    'netflix': {
        name: 'Netflix',
        shortDesc: '网络视频点播的 OTT 服务网站。',
        url: 'https://www.netflix.com/',
        highlights: '全球领先的流媒体娱乐平台，海量自制剧和电影。也是测试机场节点“流媒体解锁能力”的黄金标准。',
        guide: '需使用原生 IP 节点（如唯兔云的流媒体专线）才能解锁非自制剧（版权剧）。普通节点可能只能看到带有“N”标志的自制剧。',
        advanced: '通过使用特定区域的节点（如新加坡、台湾），可以获取配有原生中文字幕的影视资源。',
        warning: 'Netflix 经常封锁机房 IP。如果发现突然看不了某部剧，说明节点 IP 被 Netflix 标记为代理了，需要切换节点。'
    },
    'disney': {
        name: 'Disney+',
        shortDesc: '迪士尼的在线流媒体视频点播平台。',
        url: 'https://www.disneyplus.com/',
        highlights: '漫威、星战、皮克斯、国家地理粉丝的终极天堂。最高支持 4K HDR 和杜比视界，对宽带和节点延迟要求极高。',
        guide: '由于采用区域隔离策略，建议注册并使用美区或新加坡区账号。对 IP 要求甚至比 Netflix 更严格。',
        advanced: '搭配 Apple TV 和光速云的专线节点，可以完美输出杜比全景声，打造家庭影院级体验。',
        warning: '如果在登录时一直卡在黑色加载界面，或者提示错误代码，通常是因为节点 IP 被 Disney+ 墙了。'
    },
    'prime-video': {
        name: 'Prime Video',
        shortDesc: '亚马逊的互联网视频点播服务。',
        url: 'https://www.primevideo.com/',
        highlights: '作为 Amazon Prime 会员的附赠权益，拥有大量优秀的独占美剧（如《黑袍纠察队》）。也是跨境亚马逊卖家熟悉海外文化的窗口。',
        guide: '开通 Amazon Prime 即可使用。不同国家的 Prime Video 库不同，推荐使用美国节点解锁最全美剧资源。',
        advanced: '可以使用 X-Ray 功能在暂停时查看画面中演员的 IMDB 详细资料和背景音乐信息，非常适合英语学习。',
        warning: '频繁切换多国节点可能导致亚马逊账号被风控审核，卖家账号尤其需要小心关联风险。'
    },
    'hulu': {
        name: 'Hulu',
        shortDesc: '网络付费随选流影片及影视节目的 OTT 服务网站。',
        url: 'https://www.hulu.com/',
        highlights: '以丰富的美剧和美国本土电视直播节目见长，资源更新极快，通常在电视播出后第二天即可观看。',
        guide: '仅限美国和日本提供服务。访问 Hulu 必须使用极为纯净的美国/日本原生 IP，普通机场极难解锁。',
        advanced: '如果出海业务涉及美国本土电视广告或流行文化研究，Hulu 是最好的实时素材库。',
        warning: 'Hulu 对代理的检测堪称变态级，支付时甚至必须使用美国本土发行的信用卡。'
    },
    'instagram': {
        name: 'Instagram',
        shortDesc: '在线图片及视频分享的社群应用程序。',
        url: 'https://www.instagram.com/',
        highlights: '年轻用户的聚集地，视觉营销的终极平台。对于跨境出海的时尚、美妆、家居品牌，IG 是建立品牌调性和网红营销 (Influencer Marketing) 的核心。',
        guide: '推荐使用固定 IP 注册。使用 Facebook 账号关联登录可以降低新号被封的风险。',
        advanced: '利用 IG Reels 的推荐算法，通过短视频可以获取大量自然流量；结合 Linktree 等工具，实现个人主页多重引流。',
        warning: '新号切忌频繁点赞、海量关注或在不同 IP 之间横跳，极容易触发账号锁定甚至封号。'
    },
    'x': {
        name: 'X (Twitter)',
        shortDesc: '全球顶尖的社交媒体平台之一。',
        url: 'https://x.com/',
        highlights: '全球热点事件发源地、Crypto 币圈核心阵地以及海外客户的客服反馈中心。想要最快了解海外热点，X 是不二之选。',
        guide: '使用海外手机号或 Google/Apple 账号快捷登录。为了账号权重，建议完善头像、简介并尽早开通双重验证。',
        advanced: '利用高级搜索指令（如：关键词 min_faves:1000）能极速抓取爆款推文；跨境 SaaS 工具创始人必做的 Build in Public 也是在此进行。',
        warning: '避免发布涉及敏感、暴力或严重侵犯版权的内容。IP 乱跳会导致账号被标记为机器账号，需进行图片验证。'
    },
    'reddit': {
        name: 'Reddit',
        shortDesc: '娱乐、社交及新闻网站。',
        url: 'https://www.reddit.com/',
        highlights: '“互联网的首页”，拥有成千上万个极其垂直的兴趣社区（Subreddit）。是出海做深度用户调研、寻找硬核天使用户的最佳宝地。',
        guide: '注册门槛低，但建立账号信任（Karma 积分）极其困难。新号发广告会被立刻踩（Downvote）甚至被封。',
        advanced: '千万别直接发硬广！应该先在目标社区提供有价值的干货长文，然后在评论区巧妙植入产品链接，这种“软广”转化率奇高。',
        warning: 'Reddit 社区对营销行为极其反感，如果被版主 (Mod) 判定为 Spam，不仅账号会被封，连带你的网站域名也会被该社区拉黑。'
    },
    'telegram': {
        name: 'Telegram',
        shortDesc: '跨平台的即时通信软件。',
        url: 'https://web.telegram.org/',
        highlights: '以极致的安全性、强大的 Bot 生态和无上限的群组人数著称。出海私域流量沉淀、Crypto 项目宣发、技术交流的必备工具。',
        guide: '必须使用手机号注册（强烈建议使用 Google Voice 等海外虚拟号，避免隐私泄露）。必须开启两步验证（2FA）密码。',
        advanced: '利用 Telegram Bot API 可以开发出极其强大的自动化工具，比如自动群管、消息转发、支付集成等。',
        warning: '请在隐私设置中隐藏自己的手机号码；不要随意点击陌生人发送的 APK 或可执行文件，防范盗号木马。'
    },
    'outlook': {
        name: 'Outlook',
        shortDesc: '微软的免费互联网收发电子邮件服务。',
        url: 'https://outlook.live.com/',
        highlights: '出海商务沟通的标准化工具。对商业邮件的解析度高，与 Office 365 办公生态深度绑定，是注册各种海外社交平台最稳定的邮箱之一。',
        guide: '直接访问官网注册。由于微软策略，新号刚注册时请不要立刻大量发送邮件，需“养号”。',
        advanced: '利用别名 (Alias) 功能，可以在一个主账号下创建多达 10 个不同的邮箱地址，方便管理不同业务线而不串号。',
        warning: '如果长期使用同一个 IP 批量注册 Outlook，会导致该 IP 所在段被拉黑，要求手机号接码验证。'
    },
    'gmail': {
        name: 'Gmail',
        shortDesc: 'Google 的免费电子邮件服务。',
        url: 'https://gmail.google.com/',
        highlights: '全球市场占有率最高的个人邮箱，注册几乎所有海外主流平台的“万能通行证”。',
        guide: '注册时通常会遇到“此号码无法用于验证”的死胡同。建议在手机端下载 Gmail App，通过手机端进行注册，成功率更高。',
        advanced: '灵活运用 “你的账号+任意字符@gmail.com” 的无限邮箱技巧，可以轻松进行海外工具的多账号撸羊毛测试。',
        warning: '不要用国内手机号长期绑定，建议更换为海外手机号，并开启 Google Authenticator 以防被盗。'
    },
    'proton-mail': {
        name: 'Proton Mail',
        shortDesc: '端到端加密的电子邮件服务。',
        url: 'https://mail.proton.me/',
        highlights: '主打极致的隐私与安全，总部位于瑞士，不受美国数据管辖。是 Web3 领域、匿名爆料者和对隐私要求极高的出海业务首选。',
        guide: '注册不需要提供手机号和任何个人信息。推荐使用干净节点访问注册，否则可能会被要求进行真人验证。',
        advanced: '可以配置极其复杂的加密过滤规则，邮件在服务器端是完全加密存储的，连 Proton 官方都无法偷看你的邮件内容。',
        warning: '由于其高匿名性，经常被用于注册黑产账号，导致部分严格的海外电商平台会拒收来自 proton.me 后缀的邮件。'
    },
    'temp-mail': {
        name: 'Temp Mail',
        shortDesc: '匿名的一次性电子邮件。',
        url: 'https://temp-mail.org/zh/',
        highlights: '无需注册，打开网页即自动分配一个邮箱地址，接收完验证码后随时可以丢弃。专治各种“必须注册才能阅读”的流氓网站。',
        guide: '打开即用。网页只要不关闭，邮箱就一直有效。收到邮件后点击链接即可。',
        advanced: '配合自动化脚本，可以实现大批量的海外小号自动化注册（但仅限对风控要求极低的平台）。',
        warning: '千万不要用临时邮箱注册重要账号（如交易所、银行、主营业务社交账号）！一旦关闭网页，邮箱即销毁，密码丢失将永远无法找回。'
    },
    'telegraph': {
        name: 'Telegraph',
        shortDesc: 'Telegram 的内容发布网站。',
        url: 'https://telegra.ph/',
        highlights: '极其极简的匿名长文发布平台。无需登录、无需注册，所见即所得的编辑器，支持插入图片和推文，生成后立马拥有一个超快加载的网页。',
        guide: '直接输入 Title 和作者，即可开始写正文。写完点击 Publish，复制右上角 URL 即可分享。',
        advanced: '由于其在国内部分地区未被完全封锁（或者可以通过特殊渠道访问），常被用于生成引流软文或规避微信内链屏蔽。',
        warning: '如果你清除了浏览器缓存，你将永远失去这篇匿名文章的编辑权限。如果需要长期维护，请在 Telegram 中绑定 Telegraph Bot。'
    },
    'reurl': {
        name: 'Reurl',
        shortDesc: '短链接在线生成。',
        url: 'https://reurl.cc/main/cn',
        highlights: '出海营销人员必不可少的工具。将又长又丑带有大量 UTM 追踪参数的 URL，压缩成干净利落的短链，提升点击率。',
        guide: '粘贴长链接，点击转换即可。该平台在亚太地区尤其是台湾市场使用率极高。',
        advanced: '可以追踪短链的点击次数、地理位置来源等数据，用于评估海外广告投放的实际 ROI 效果。',
        warning: '在部分严格的社交平台（如 Facebook）中，如果短链跳转的最终目标被判定为垃圾网站，短链服务商也会连带被风控。'
    },
    'subscription-converter': {
        name: 'Subscription Converter',
        shortDesc: '各种订阅链接生成。',
        url: 'https://sub-web.netlify.app/',
        highlights: '折腾机场和科学上网客户端的终极神器。能够将 V2ray、SS、SSR 等原始订阅链接，转化为 Clash、Surge、Quantumult X 等各种客户端识别的格式。',
        guide: '将你的机场订阅链接粘贴到输入框，选择你的客户端（如 Clash），点击生成专属订阅链接即可。',
        advanced: '可以自定义勾选“包含节点特征过滤”或“添加增强规则”，实现不同国家节点的智能分流（比如自动让奈飞走新加坡节点）。',
        warning: '请尽量使用自己部署的 Sub-converter 后端，不要随意使用来路不明的公共转换器，以免你的节点账号被黑客盗取。'
    },
    'fast': {
        name: 'Fast',
        shortDesc: '奈飞的简单网速测试。',
        url: 'https://fast.com/',
        highlights: '由 Netflix 官方提供，极简的测速页面。它的特殊之处在于，它直接连接 Netflix 的服务器群进行测速。',
        guide: '打开即测，没有任何广告和复杂按钮。',
        advanced: '如果你用 Speedtest 测速很快，但看奈飞却很卡，这时候用 Fast.com 一测便知——很多机场会对 Speedtest 进行定向加速造假，但骗不过 Fast.com。',
        warning: '测出来的结果主要反映了你到 Netflix 视频服务器的带宽，并不能代表你访问所有网站的速度。'
    },
    'whoer': {
        name: 'Whoer',
        shortDesc: 'IP 伪装度检测。',
        url: 'https://whoer.net/zh',
        highlights: '跨境电商卖家、海外广告投手（Facebook Ads、Google Ads）防封号的自检神器。能够全面检测你的 IP 纯净度、DNS 泄露、系统时间时区匹配度。',
        guide: '打开网站，等待其打分。如果得分低于 80 分，说明你的代理环境存在较大破绽。',
        advanced: '除了检测 IP，它还能查出你的 WebRTC 泄露问题。高阶玩家通常会结合指纹浏览器（如紫鸟、AdsPower）将分数调整至 100% 伪装。',
        warning: '如果你的 IP 所在地和操作系统的时区、语言设置严重不符，极易被跨境电商平台判定为高风险账号。'
    },
    'ping0': {
        name: 'PING0',
        shortDesc: 'IP 纯净度检测。',
        url: 'https://ping0.cc/',
        highlights: '中文圈极好用的 IP 欺诈分（Fraud Score）查询工具。它可以直观地告诉你，当前节点是“干净的家宽”还是“烂大街的机房 IP”。',
        guide: '挂上你的代理节点，访问该网站，直接查看 IP 风险评级和 ASN 归属地。',
        advanced: '在注册 ChatGPT、TikTok 或各种高风控平台前，先来 PING0 测一下，如果是高风险机房 IP，请立刻换节点，避免浪费账号。',
        warning: '没有任何一个检测工具是 100% 准确的，但 PING0 的大红警告绝对值得你警惕。'
    },
    'browserleaks': {
        name: 'BrowserLeaks',
        shortDesc: 'DNS 泄露检测。',
        url: 'https://browserleaks.com/dns',
        highlights: '深度的浏览器隐私泄露检测工具库。不仅检测 DNS，还能检测 Canvas 指纹、WebGL、字体库指纹等极深层的追踪技术。',
        guide: '点击不同的测试项即可。对于普通科学上网用户，重点看 DNS Leak 测试，如果出现了中国的 DNS 服务器（如 114 或 腾讯阿里），说明你的代理漏网了。',
        advanced: '是高级红客（安全人员）和反追踪爱好者的标配网站，用于验证自己的反侦查浏览器的防御强度。',
        warning: '理解 Canvas 指纹防追踪的门槛较高，普通用户只需确保 DNS 能够正确解析在海外即可。'
    },
    'ipcheck': {
        name: 'IPCheck',
        shortDesc: '好用和开源的全能 IP 工具箱。',
        url: 'https://ipcheck.ing/',
        highlights: '集成度极高的网络测试面板。一屏之内不仅展示你的当前 IP，还能同步进行全球多地的延迟测试、流媒体解锁测试和黑名单查询。',
        guide: '适合把它设为代理客户端开启后的首页。看一眼即可确认代理是否生效、节点归属地是否准确。',
        advanced: '其开源特性意味着你可以将这套检测逻辑部署在自己的 VPS 上，作为私有的节点监控看板。',
        warning: '页面加载的信息较多，如果节点速度很慢，可能会出现部分组件一直在转圈的情况。'
    }
};

let navHtml = fs.readFileSync(path.join(__dirname, '..', 'nav.html'), 'utf8');

// HTML template for individual tool pages
const template = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>【深度教程】{{name}} 注册配置与高阶进阶玩法 - 云端甄选</title>
    <meta name="description" content="全网最详细的 {{name}} 教程。提供 {{name}} 的注册指南、防封号避坑技巧及进阶用途，适合出海跨境人员参考。">
    <link rel="stylesheet" href="./css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        .review-header { background: linear-gradient(135deg, rgba(31, 41, 55, 1) 0%, rgba(17, 24, 39, 1) 100%); color: white; padding: 60px 0; text-align: center; }
        .review-title { font-size: 36px; font-weight: 700; margin-bottom: 20px; color: var(--color-primary); }
        .review-subtitle { font-size: 18px; opacity: 0.8; max-width: 600px; margin: 0 auto; line-height: 1.6; }
        .content-section { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); margin-bottom: 40px; }
        .section-title { font-size: 22px; font-weight: 600; color: var(--color-secondary); margin-bottom: 20px; display: flex; align-items: center; border-bottom: 2px solid rgba(182,141,64,0.1); padding-bottom: 10px; }
        .text-content { font-size: 16px; line-height: 1.8; color: #4b5563; }
        .text-content strong { color: var(--color-secondary); }
        .action-box { text-align: center; padding: 30px; background: rgba(182,141,64,0.05); border-radius: 12px; border: 1px dashed var(--color-primary); }
    </style>
</head>
<body>
    <header class="navbar">
        <div class="container nav-content">
            <div class="logo">
                <span class="logo-icon">✨</span>
                <span class="logo-text">云端甄选 <span style="font-weight: 400; font-size: 16px; opacity: 0.8;">| 智能机场匹配</span></span>
            </div>
            <nav class="nav-links">
                <a href="nav.html">← 返回导航</a>
                <a href="ranking.html">权威榜单</a>
            </nav>
        </div>
    </header>

    <div class="review-header">
        <div class="container">
            <h1 class="review-title">{{name}} 深度玩法指南</h1>
            <p class="review-subtitle">{{shortDesc}}</p>
        </div>
    </div>

    <main class="container" style="margin-top: -30px; position: relative; z-index: 10; padding-bottom: 80px;">
        <div class="content-section">
            <h2 class="section-title">🌟 核心亮点与出海适用场景</h2>
            <div class="text-content">
                <p>{{highlights}}</p>
                <p>无论你是跨境电商卖家、独立站站长还是海外自媒体运营，熟练掌握 <strong>{{name}}</strong> 都是提升工作效率的关键。</p>
            </div>
        </div>

        <div class="content-section">
            <h2 class="section-title">🛠️ 新手注册与基础配置指南</h2>
            <div class="text-content">
                <p>{{guide}}</p>
                <p><strong>网络环境建议：</strong>在注册此类海外平台时，强烈建议搭配使用 <a href="ranking.html" target="_blank" style="color:var(--color-primary);text-decoration:underline;">高品质原生 IP 机场节点</a>，以避免遇到人机验证或直接被拦截的情况。</p>
            </div>
        </div>

        <div class="content-section">
            <h2 class="section-title">💡 高阶进阶玩法</h2>
            <div class="text-content">
                <p>{{advanced}}</p>
            </div>
        </div>

        <div class="content-section">
            <h2 class="section-title">⚠️ 避坑与防封指南</h2>
            <div class="text-content">
                <p>{{warning}}</p>
            </div>
        </div>

        <div class="action-box">
            <h3 style="margin-bottom: 15px; font-size: 20px;">准备好体验 {{name}} 了吗？</h3>
            <p style="margin-bottom: 20px; color: #6b7280; font-size: 14px;">直达官方页面，开启你的出海之旅</p>
            <a href="{{url}}" target="_blank" class="btn btn-primary" style="padding: 12px 30px; font-size: 16px;">前往 {{name}} 官网 ↗</a>
        </div>
    </main>

    <footer class="footer">
        <div class="container footer-content">
            <p>&copy; 2026 jichangxuanze.com 云端甄选. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;

for (let key in toolsData) {
    let tool = toolsData[key];
    let html = template
        .replace(/\{\{name\}\}/g, tool.name)
        .replace(/\{\{shortDesc\}\}/g, tool.shortDesc)
        .replace(/\{\{highlights\}\}/g, tool.highlights)
        .replace(/\{\{guide\}\}/g, tool.guide)
        .replace(/\{\{advanced\}\}/g, tool.advanced)
        .replace(/\{\{warning\}\}/g, tool.warning)
        .replace(/\{\{url\}\}/g, tool.url);
    
    fs.writeFileSync(path.join(__dirname, '..', `tool-${key}.html`), html);
    
    // Update nav.html using robust regex
    // We look for the <a> tag that contains this tool's name
    let escapedUrl = tool.url.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\$&');
    let regexStr = `<a href="${escapedUrl}" target="_blank" class="nav-item-card">\\s*<div class="nav-item-title">${tool.name} <span>↗<\\/span><\\/div>\\s*<div class="nav-item-desc">[^<]*<\\/div>\\s*<\\/a>`;
    let regex = new RegExp(regexStr, 'g');
    
    let replacement = `<div class="nav-item-card">
                    <a href="${tool.url}" target="_blank" style="text-decoration:none;">
                        <div class="nav-item-title">${tool.name} <span style="color:var(--color-primary);">↗</span></div>
                    </a>
                    <div class="nav-item-desc">${tool.shortDesc}</div>
                    <a href="tool-${key}.html" class="btn btn-outline" style="margin-top:15px; padding:8px 0; text-align:center; display:block; font-size:13px; border-radius:6px; background:rgba(182,141,64,0.05); transition:all 0.3s;">📖 深度教程与玩法指南</a>
                </div>`;
                
    navHtml = navHtml.replace(regex, replacement);
}

fs.writeFileSync(path.join(__dirname, '..', 'nav.html'), navHtml);
console.log('SUCCESS: Generated 25 tool pages and updated nav.html');
