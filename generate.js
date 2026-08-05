const fs = require('fs');
const path = require('path');

const folders = ['doing', 'essay', 'playground', 'about'];
const nav = [];
const index = { essay: [], doing: [], playground: [] };

for (const folder of folders) {
    const folderPath = path.join(process.cwd(), folder);
    if (fs.existsSync(folderPath)) {
        const indexPath = path.join(folderPath, 'index.html');
        if (fs.existsSync(indexPath)) {
            const html = fs.readFileSync(indexPath, 'utf-8');
            const match = html.match(/<title>([^<]*)<\/title>/);
            const title = match ? match[1] : folder;
            nav.push({ path: folder, title: title });
        }
        if (folder !== 'about' && folder !== 'playground') {
            const files = fs.readdirSync(folderPath);
            const txtFiles = files.filter(f => f.endsWith('.txt')).map(f => f.replace('.txt', ''));
            if (txtFiles.length > 0) {
                index[folder] = txtFiles;
            }
        }
        if (folder === 'playground') {
            const files = fs.readdirSync(folderPath);
            const htmlFiles = files.filter(f => f.endsWith('.html') && f !== 'index.html').map(f => f.replace('.html', ''));
            if (htmlFiles.length > 0) {
                index.playground = htmlFiles;
            }
        }
    }
}

fs.writeFileSync('nav.json', JSON.stringify(nav, null, 2));
fs.writeFileSync('index.json', JSON.stringify(index, null, 2));
console.log('nav.json and index.json generated');