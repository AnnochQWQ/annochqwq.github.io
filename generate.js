const fs = require('fs');
const path = require('path');

const excludeDirs = ['assets', '.github', 'functions', 'node_modules'];
const order = ['doing', 'essay', 'playground', 'message', 'about'];
const nav = [];
const index = { essay: [], doing: [], playground: [] };

function parseDateFromFilename(filename) {
    const match = filename.match(/^(\d{4}-\d{2}-\d{2})-/);
    return match ? match[1] : null;
}

function getDisplayName(filename) {
    return filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace('.txt', '');
}

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
                const date = parseDateFromFilename(f);
                const name = getDisplayName(f);
                return {
                    name: name,
                    nameWithExt: f,
                    date: date,
                    sortKey: date || f
                };
            })
            .sort((a, b) => {
                if (a.date && b.date) return b.date.localeCompare(a.date);
                if (a.date) return -1;
                if (b.date) return 1;
                return b.sortKey.localeCompare(a.sortKey);
            });
        if (txtFiles.length > 0) {
            index[folder] = txtFiles;
        }
    }
    if (folder === 'playground') {
        const files = fs.readdirSync(folderPath);
        const htmlFiles = files
            .filter(f => f.endsWith('.html') && f !== 'index.html')
            .map(f => f.replace('.html', ''))
            .sort();
        if (htmlFiles.length > 0) {
            index.playground = htmlFiles;
        }
    }
}

fs.writeFileSync('nav.json', JSON.stringify(nav, null, 2));
fs.writeFileSync('index.json', JSON.stringify(index, null, 2));
console.log('nav.json and index.json generated');