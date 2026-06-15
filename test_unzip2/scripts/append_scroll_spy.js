const fs = require('fs');
const jsPath = 'c:/Users/user/OneDrive/Desktop/发布博客/jichangxuanze.com博客/js/app.js';
let jsCode = fs.readFileSync(jsPath, 'utf8');

if (!jsCode.includes('IntersectionObserver')) {
    const scrollSpyCode = `

// ====== 侧边栏目录滚动监听 (Scroll Spy) ======
document.addEventListener('DOMContentLoaded', function() {
    const tocLinks = document.querySelectorAll('.toc-link');
    if (tocLinks.length === 0) return;

    // 获取所有目录对应的心跳锚点
    const sections = Array.from(tocLinks).map(link => {
        const id = link.getAttribute('href').substring(1);
        return document.getElementById(id);
    }).filter(el => el !== null);

    if (sections.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                tocLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current intersecting link
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(\`.toc-link[href="#\${id}"]\`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
});
`;
    fs.writeFileSync(jsPath, jsCode + scrollSpyCode);
    console.log('Scroll spy logic added to app.js');
}
