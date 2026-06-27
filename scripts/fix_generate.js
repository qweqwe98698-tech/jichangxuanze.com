const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const files = fs.readdirSync('..').filter(f => f.startsWith('review-') && f.endsWith('.html'));

const mapping = {};
for (let f of files) {
    const content = fs.readFileSync(path.join('..', f), 'utf8');
    const match = content.match(/<meta property="og:title" content="(.*?)" \/>/);
    if (match) {
        mapping[match[1]] = f.replace('review-', '').replace('.html', '');
    }
}

const generateJsPath = path.join(__dirname, 'generate.js');
let content = fs.readFileSync(generateJsPath, 'utf8');

// Replace the array of strings with an array of objects
if (content.includes('const airports = [')) {
    console.log('Patching generate.js...');
    
    let injectedMapping = 'const airportSlugMap = ' + JSON.stringify(mapping, null, 4) + ';\n';
    
    // We can inject airportSlugMap after DEEPSEEK_API_KEY
    if (!content.includes('const airportSlugMap =')) {
        content = content.replace('// 待生成的机场列表（已扩充至全部 81 家）', injectedMapping + '\n// 待生成的机场列表（已扩充至全部 81 家）');
    }
    
    // Fix fileName assignment
    let oldCode = 'const fileName = `review-${safeName}.html`;';
    let newCode = 'let fileName = `review-${safeName}.html`;\n        if (airportSlugMap[airport]) {\n            fileName = `review-${airportSlugMap[airport]}.html`;\n        }';
    
    if (content.includes(oldCode)) {
        content = content.replace(oldCode, newCode);
    }
    
    fs.writeFileSync(generateJsPath, content);
    console.log('Fixed generate.js');
}
