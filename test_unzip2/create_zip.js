const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const zipPath = path.join(__dirname, 'site_update_final.zip');

if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
}

try {
    execSync(`powershell -Command "Compress-Archive -Path '*.*', 'css', 'js', 'scripts' -DestinationPath '${zipPath}' -Force"`, { stdio: 'inherit' });
    console.log('Zip created successfully at ' + zipPath);
} catch (err) {
    console.error('Failed to create zip', err);
}
