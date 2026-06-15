const fs = require('fs');
const path = require('path');
const updates = [
    {name:'唯兔云', newLink:'https://wt03.fedttt.my/#/?code=xIutqOBA'},
    {name:'全球云', newLink:'https://mn7jr.quanatt.my/#/?code=Ov2nvU9C'},
    {name:'极连云', newLink:'https://dshjsd7sh.jilianat.my/#/?code=VM1rKGUu'}
]; 

updates.forEach(u => {
    let p = path.join(__dirname, '..', 'review-' + u.name + '.html'); 
    if(fs.existsSync(p)){
        let h = fs.readFileSync(p,'utf8'); 
        let r = new RegExp('(href=")[^"]+(" target="_blank" class="btn btn-primary")', 'g'); 
        h = h.replace(r, '$1' + u.newLink + '$2'); 
        fs.writeFileSync(p, h);
        console.log('Updated', p);
    }
});
