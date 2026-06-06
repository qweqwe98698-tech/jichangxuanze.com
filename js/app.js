// js/app.js

// 机场推广链接配置库 (请替换为您的真实返利链接)
const airportLinks = {
    '光速云': 'https://example.com/aff=guangsu',
    '唯兔云': 'https://example.com/aff=weitu',
    '全球云': 'https://example.com/aff=quanqiu',
    '二猫云': 'https://example.com/aff=ermao',
    '极连云': 'https://example.com/aff=jilian'
};

function openMatcherModal() {
    document.getElementById('matcher-modal').classList.add('active');
    document.body.style.overflow = 'hidden'; // 防止背景滚动
    resetMatcher();
}

function closeMatcherModal() {
    document.getElementById('matcher-modal').classList.remove('active');
    document.body.style.overflow = '';
}

let userAnswers = {};

function selectOption(step, value, element) {
    userAnswers[step] = value;
    
    // 更新UI的高亮状态
    const buttons = element.parentElement.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    element.classList.add('selected');

    // 自动跳到下一步或显示结果
    setTimeout(() => {
        if (step === 'usage') {
            document.getElementById('step-1').classList.remove('active');
            document.getElementById('step-2').classList.add('active');
        } else if (step === 'budget') {
            showLoadingAndResult();
        }
    }, 400);
}

function showLoadingAndResult() {
    document.getElementById('step-2').classList.remove('active');
    const loadingScreen = document.getElementById('step-loading');
    loadingScreen.classList.add('active');

    // 模拟大数据计算的进度条
    const progressBar = document.querySelector('.progress-fill');
    progressBar.style.width = '0%';
    
    setTimeout(() => { progressBar.style.width = '40%'; }, 500);
    setTimeout(() => { progressBar.style.width = '80%'; }, 1500);
    
    setTimeout(() => {
        progressBar.style.width = '100%';
        setTimeout(() => {
            loadingScreen.classList.remove('active');
            displayFinalResult();
        }, 500);
    }, 2500);
}

function displayFinalResult() {
    const resultScreen = document.getElementById('step-result');
    resultScreen.classList.add('active');

    const resultName = document.getElementById('result-name');
    const resultDesc = document.getElementById('result-desc');
    
    // 简单的推荐逻辑映射到Top5
    const usage = userAnswers['usage'];
    const budget = userAnswers['budget'];

    // 逻辑优化：只要预算选择了“高端尊享”，作为 NO.1 的光速云必定首发推荐
    if (budget === 'high') {
        resultName.innerText = '光速云';
        resultDesc.innerText = '99.9% SLA 顶级专线，8K 秒开，无可挑剔的王者体验。';
    } else if (usage === 'ai') {
        resultName.innerText = '全球云';
        resultDesc.innerText = '100% 原生 IP，欺诈分极低，您的 AI 与跨境工作专属护航者。';
    } else if (usage === 'gaming') {
        resultName.innerText = '二猫云';
        resultDesc.innerText = '28ms 极致低延迟，几乎物理直连，为您打造电竞级游戏体验。';
    } else if (budget === 'low') {
        resultName.innerText = '极连云';
        resultDesc.innerText = '极高性价比，10Gbps 超大带宽，大流量肆意用。';
    } else {
        resultName.innerText = '唯兔云';
        resultDesc.innerText = '千兆跑满，高性价比流媒体解锁首选，小白极度友好。';
    }

    // 动态更新返利链接
    document.getElementById('result-aff-link').href = airportLinks[resultName.innerText] || '#';
}

function resetMatcher() {
    userAnswers = {};
    document.querySelectorAll('.step-pane').forEach(el => el.classList.remove('active'));
    document.getElementById('step-1').classList.add('active');
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
}

// ====== 动态通用弹窗逻辑 (用于另外 5 个工具) ======

const toolConfigs = {
    calc: {
        title: "性价比雷达分析",
        desc: "请输入您的月度流量需求（基于预算智能折算）",
        options: [
            { id: '10g', label: '轻度 (10-50GB)', target: '极连云', targetDesc: '极致性价比，轻量用户的防坑首选。' },
            { id: '100g', label: '中度主力 (100-500GB)', target: '唯兔云', targetDesc: '跑满千兆，价格与体验的完美平衡点。' },
            { id: '1000g', label: '重度下载 (1TB以上)', target: '极连云', targetDesc: '10Gbps 超大带宽接入，大流量跑量神盘。' }
        ]
    },
    risk: {
        title: "跑路风险特征排查",
        desc: "您当前的机场或心仪的机场是否有以下特征？",
        options: [
            { id: 'cheap', label: '长期年付骨折促销', target: '光速云', targetDesc: '促销越猛跑路越快。为您推荐真正 99.9% 稳定运行的高端盘光速云。' },
            { id: 'offline', label: '晚高峰经常失联掉线', target: '唯兔云', targetDesc: '技术实力差的特征。为您推荐拥有强大维护团队的唯兔云。' },
            { id: 'new', label: '成立时间不足半年', target: '全球云', targetDesc: '新盘不稳定，建议选择拥有海量优质 ISP 资源的全球云。' },
            { id: 'none', label: '都很正常，只想换个好的', target: '二猫云', targetDesc: '为您推荐极速短连接网络二猫云，体验物理级直连快感。' }
        ]
    },
    chatgpt: {
        title: "AI 解锁环境智能诊断",
        desc: "您使用 AI 工具的主要场景是？",
        options: [
            { id: 'chat', label: '日常网页端对话提问', target: '全球云', targetDesc: '提供 100% 极低欺诈分的原生 IP，彻底告别封号噩梦。' },
            { id: 'api', label: 'API 开发与高并发调用', target: '全球云', targetDesc: '干净的家宽 IP 矩阵，保障 API 调用不会触发风控拦截。' },
            { id: 'tiktok', label: '海外社媒 + AI 运营矩阵', target: '全球云', targetDesc: '小众稀有国家级节点全覆盖，精准应对严格的地理位置风控。' }
        ]
    },
    stream: {
        title: "流媒体解锁环境评测",
        desc: "您最在意的流媒体平台与画质要求？",
        options: [
            { id: 'netflix', label: 'Netflix 4K 秒开', target: '唯兔云', targetDesc: '流媒体专精优化，全节点原生解锁 Netflix 完整版权库。' },
            { id: 'disney', label: 'Disney+ / HBO Max', target: '光速云', targetDesc: '全球顶级专线护航，提供丝滑无缓冲的杜比视界体验。' },
            { id: 'youtube', label: 'YouTube 8K 极限拖拽', target: '光速云', targetDesc: '超低延迟加上 280,000 Kbps 惊人跑分，8K 画质随心看。' },
            { id: 'anime', label: 'Bilibili 港台 / 动画疯', target: '二猫云', targetDesc: '亚太精品线路深耕，台湾与香港节点速度拉满。' }
        ]
    },
    client: {
        title: "科学上网客户端诊断",
        desc: "您当前主要使用什么设备科学上网？",
        options: [
            { id: 'win', label: '🖥️ Windows 电脑', target: '唯兔云', targetDesc: '推荐搭配 Clash Verge，不知道怎么配？唯兔云提供傻瓜式一键导入。' },
            { id: 'mac', label: '🍎 macOS 苹果电脑', target: '光速云', targetDesc: '高端玩家必备，搭配 Surge / Clash X 榨干光速云的所有性能潜力。' },
            { id: 'ios', label: '📱 iOS / iPad 移动端', target: '全球云', targetDesc: '搭配 Shadowrocket (小火箭) 使用，随时随地保持原生 IP 环境。' },
            { id: 'android', label: '🤖 Android 安卓手机', target: '唯兔云', targetDesc: '推荐 v2rayNG，直接使用唯兔云的专属订阅无缝衔接。' }
        ]
    }
};

let currentDynamicTarget = null;
let currentDynamicTargetDesc = null;

function openDynamicModal(toolId) {
    const config = toolConfigs[toolId];
    if (!config) return;

    // 填充内容
    document.getElementById('dynamic-title').innerText = config.title;
    document.getElementById('dynamic-desc').innerText = config.desc;
    
    const optionsContainer = document.getElementById('dynamic-options');
    optionsContainer.innerHTML = '';
    
    config.options.forEach(opt => {
        const btn = document.createElement('div');
        btn.className = 'option-btn';
        btn.innerText = opt.label;
        btn.onclick = function() {
            // 设置选中高亮
            optionsContainer.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            
            currentDynamicTarget = opt.target;
            currentDynamicTargetDesc = opt.targetDesc;
            
            // 延迟一点进入加载动画
            setTimeout(() => {
                showDynamicLoading();
            }, 400);
        };
        optionsContainer.appendChild(btn);
    });

    document.getElementById('dynamic-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
    resetDynamicModal();
}

function closeDynamicModal() {
    document.getElementById('dynamic-modal').classList.remove('active');
    document.body.style.overflow = '';
}

function resetDynamicModal() {
    document.getElementById('dynamic-modal').querySelectorAll('.step-pane').forEach(el => el.classList.remove('active'));
    document.getElementById('dynamic-step').classList.add('active');
}

function showDynamicLoading() {
    document.getElementById('dynamic-step').classList.remove('active');
    const loadingScreen = document.getElementById('dynamic-loading');
    loadingScreen.classList.add('active');

    const progressBar = document.getElementById('dynamic-progress');
    progressBar.style.width = '0%';
    
    setTimeout(() => { progressBar.style.width = '30%'; }, 400);
    setTimeout(() => { progressBar.style.width = '70%'; }, 1200);
    
    setTimeout(() => {
        progressBar.style.width = '100%';
        setTimeout(() => {
            loadingScreen.classList.remove('active');
            displayDynamicResult();
        }, 400);
    }, 2000);
}

function displayDynamicResult() {
    document.getElementById('dynamic-result').classList.add('active');
    document.getElementById('dynamic-result-name').innerText = currentDynamicTarget;
    document.getElementById('dynamic-result-desc').innerText = currentDynamicTargetDesc;
    
    // 动态更新返利链接
    document.getElementById('dynamic-aff-link').href = airportLinks[currentDynamicTarget] || '#';
}

// ====== 教程选项卡切换逻辑 ======
function switchTutorial(platform) {
    // 移除所有 active 状态
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tutorial-panel').forEach(panel => panel.classList.remove('active'));
    
    // 给点击的按钮加 active
    event.currentTarget.classList.add('active');
    
    // 显示对应的面板
    document.getElementById(`tut-${platform}`).classList.add('active');
}
