const fs = require('fs');

const files = ['articles.html', 'index.html', 'ranking.html'];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    
    // Use regex to match the inserted spider-link and replace it with just the keyword
    // <a href="blog-..." title="..." class="spider-link" style="...">keyword</a>
    const regex = /<a href="[^"]+" title="[^"]+" class="spider-link" style="[^"]+">([^<]+)<\/a>/g;
    
    const newContent = content.replace(regex, '$1');
    
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Fixed', file);
    } else {
        console.log('No fixes needed for', file);
    }
});
