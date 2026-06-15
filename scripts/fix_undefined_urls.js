const fs = require('fs');
const path = require('path');

const urls = {
    'chatgpt': 'https://chatgpt.com/',
    'deepseek': 'https://chat.deepseek.com/',
    'gemini': 'https://gemini.google.com/',
    'grok': 'https://grok.com/',
    'claude': 'https://claude.ai/',
    'youtube': 'https://www.youtube.com/',
    'netflix': 'https://www.netflix.com/',
    'disney': 'https://www.disneyplus.com/',
    'prime-video': 'https://www.primevideo.com/',
    'hulu': 'https://www.hulu.com/',
    'instagram': 'https://www.instagram.com/',
    'x': 'https://x.com/',
    'reddit': 'https://www.reddit.com/',
    'telegram': 'https://web.telegram.org/',
    'outlook': 'https://outlook.live.com/',
    'gmail': 'https://gmail.google.com/',
    'proton-mail': 'https://mail.proton.me/',
    'temp-mail': 'https://temp-mail.org/zh/',
    'telegraph': 'https://telegra.ph/',
    'reurl': 'https://reurl.cc/main/cn',
    'subscription-converter': 'https://sub-web.netlify.app/',
    'fast': 'https://fast.com/',
    'whoer': 'https://whoer.net/zh',
    'ping0': 'https://ping0.cc/',
    'browserleaks': 'https://browserleaks.com/dns',
    'ipcheck': 'https://ipcheck.ing/'
};

for (let key in urls) {
    let p = path.join(__dirname, '..', `tool-${key}.html`);
    if(fs.existsSync(p)){
        let h = fs.readFileSync(p, 'utf8');
        h = h.replace(/href="undefined"/g, `href="${urls[key]}"`);
        fs.writeFileSync(p, h);
    }
}

// Also let's fix expand_nav_tutorials_spintax.js just in case we need to run it again.
const scriptPath = path.join(__dirname, 'expand_nav_tutorials_spintax.js');
if (fs.existsSync(scriptPath)) {
    let scriptContent = fs.readFileSync(scriptPath, 'utf8');
    for (let key in urls) {
        let regex = new RegExp(`('${key}':\\s*\\{[^}]+)painpoint:([^}]+)\\}`, 'g');
        scriptContent = scriptContent.replace(regex, `$1painpoint:$2, url: '${urls[key]}' }`);
    }
    fs.writeFileSync(scriptPath, scriptContent);
}

console.log("URLs fixed in all 25 HTML files and in the generator script!");
