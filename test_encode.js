const https = require('https');
https.get('https://jichangxuanze.com/articles', {headers: {'User-Agent': 'Mozilla/5.0'}}, (res) => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => {
        const matches = data.match(/href="blog-[^"]+"/g);
        console.log(matches ? matches.slice(0, 5) : 'None');
    });
});
