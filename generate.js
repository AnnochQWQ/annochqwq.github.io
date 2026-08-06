const fs = require('fs');
const path = require('path');

const excludeDirs = ['assets', '.github', 'functions', 'node_modules'];
const order = ['doing', 'essay', 'playground', 'message', 'about'];
const nav = [];
const index = { essay: [], doing: [], playground: [] };

const items = fs.readdirSync(process.cwd(), { withFileTypes: true });
const folders = items
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => !excludeDirs.includes(name))
    .sort((a, b) => {
        const indexA = order.indexOf(a);
        const indexB = order.indexOf(b);
        if (indexA === -1 && indexB === -1) return a.localeCompare(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

for (const folder of folders) {
    const folderPath = path.join(process.cwd(), folder);
    const indexPath = path.join(folderPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        const html = fs.readFileSync(indexPath, 'utf-8');
        const match = html.match(/<title>([^<]*)<\/title>/);
        const title = match ? match[1] : folder;
        nav.push({ path: folder, title: title });
    }
    if (folder !== 'about' && folder !== 'playground') {
        const files = fs.readdirSync(folderPath);
        const txtFiles = files
            .filter(f => f.endsWith('.txt'))
            .map(f => {
                const filePath = path.join(folderPath, f);
                const stats = fs.statSync(filePath);
                const mtime = stats.mtime; // 保留完整时间对象
                return {
                    name: f.replace('.txt', ''),
                    nameWithExt: f,
                    mtime: mtime.toISOString() // 转为 ISO 格式字符串
                };
            })
            .sort((a, b) => new Date(b.mtime) - new Date(a.mtime));
        if (txtFiles.length > 0) {
            index[folder] = txtFiles;
        }
    }
    if (folder === 'playground') {
        const files = fs.readdirSync(folderPath);
        const htmlFiles = files
            .filter(f => f.endsWith('.html') && f !== 'index.html')
            .map(f => {
                const filePath = path.join(folderPath, f);
                const stats = fs.statSync(filePath);
                return {
                    name: f.replace('.html', ''),
                    nameWithExt: f,
                    mtime: stats.mtime.toISOString()
                };
            })
            .sort((a, b) => new Date(b.mtime) - new Date(a.mtime))
            .map(item => item.name);
        if (htmlFiles.length > 0) {
            index.playground = htmlFiles;
        }
    }
}

fs.writeFileSync('nav.json', JSON.stringify(nav, null, 2));
fs.writeFileSync('index.json', JSON.stringify(index, null, 2));
console.log('nav.json and index.json generated');