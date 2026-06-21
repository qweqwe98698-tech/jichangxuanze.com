const fs = require('fs');
const content = fs.readFileSync('articles.html', 'utf8');
const match = content.match(/<a href="(blog-[^"]+)"/);
if (match) {
    console.log("Found in articles.html:", match[1]);
    if (fs.existsSync(match[1])) {
        console.log("File exists locally!");
    } else {
        console.log("File DOES NOT exist locally!");
    }
} else {
    console.log("Not found in articles.html");
}
