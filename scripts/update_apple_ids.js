const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

async function updateAppleIDs() {
    console.log('Starting Puppeteer to fetch Apple IDs...');
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        console.log('Navigating to appark.ai...');
        await page.goto('https://appark.ai/cn/us-appleid-shared', { waitUntil: 'networkidle2', timeout: 60000 });
        
        // Extract accounts
        const accounts = await page.evaluate(() => {
            const results = [];
            // Appark uses specific structure we found earlier
            const cards = document.querySelectorAll('.account-item-card');
            cards.forEach(card => {
                const emailEl = card.querySelector('span.font-mono');
                const passwordBtn = card.querySelectorAll('button')[1]; // Second button is copy password
                
                if (emailEl && passwordBtn) {
                    const email = emailEl.innerText.trim();
                    const passwordStr = passwordBtn.getAttribute('onclick');
                    let password = "";
                    if (passwordStr) {
                        const match = passwordStr.match(/copyText\('([^']+)'/);
                        if (match && match[1]) {
                            password = match[1];
                        }
                    }
                    
                    if (email && password) {
                        // format current date
                        const d = new Date();
                        const dateStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
                        
                        results.push({
                            email: email,
                            password: password,
                            region: "美国",
                            status: "正常",
                            date: dateStr
                        });
                    }
                }
            });
            return results;
        });
        
        console.log(`Extracted ${accounts.length} accounts.`);
        
        if (accounts.length > 0) {
            const htmlPath = path.join(__dirname, '..', 'free-id.html');
            let html = fs.readFileSync(htmlPath, 'utf8');
            
            // Replace the accountsData array
            const newAccountsJson = JSON.stringify(accounts, null, 12).replace(/^{/gm, '            {').replace(/^}/gm, '            }');
            
            const regex = /const accountsData = \[[\s\S]*?\];/;
            if (regex.test(html)) {
                html = html.replace(regex, `const accountsData = ${newAccountsJson};`);
                fs.writeFileSync(htmlPath, html, 'utf8');
                console.log('Successfully updated free-id.html with new accounts.');
                
                // Ping IndexNow
                try {
                    const axios = require('axios');
                    const indexNowUrl = 'https://api.indexnow.org/indexnow';
                    const payload = {
                        host: 'jichangxuanze.com',
                        key: 'f8a4b2c1d9e7f5g6h3i0j1k2l4m5n6p7',
                        keyLocation: 'https://jichangxuanze.com/f8a4b2c1d9e7f5g6h3i0j1k2l4m5n6p7.txt',
                        urlList: ['https://jichangxuanze.com/free-id.html']
                    };
                    const response = await axios.post(indexNowUrl, payload, {
                        headers: { 'Content-Type': 'application/json' }
                    });
                    console.log(`IndexNow Ping Success: ${response.status}`);
                } catch (pingErr) {
                    console.error('IndexNow Ping Failed:', pingErr.message);
                }
                
            } else {
                console.error('Could not find accountsData array in free-id.html');
            }
        } else {
            console.error('Failed to extract any accounts. The website structure might have changed.');
        }
        
    } catch (error) {
        console.error('Error fetching Apple IDs:', error);
    } finally {
        await browser.close();
    }
}

updateAppleIDs();
