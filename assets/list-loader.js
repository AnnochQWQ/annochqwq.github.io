var REPO_OWNER = 'annochqwq';
var REPO_NAME = 'annochqwq.github.io';
var BRANCH = 'main';

function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderContent(text) {
    var html = text;

    // 1. 代码块
    html = html.replace(/```\s*\n([\s\S]*?)\n\s*```/g, function(match, code) {
        return '<pre><code>' + escapeHtml(code) + '</code></pre>';
    });

    // 2. 图片
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function(match, alt, src) {
        return '<img src="' + escapeHtml(src) + '" alt="' + escapeHtml(alt) + '">';
    });

    // 3. 链接
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(match, text, url) {
        return '<a href="' + escapeHtml(url) + '" target="_blank">' + escapeHtml(text) + '</a>';
    });

    // 4. 粗体
    html = html.replace(/\*\*([^*]+)\*\*/g, function(match, content) {
        return '<strong>' + content + '</strong>';
    });

    // 5. 斜体
    html = html.replace(/\*([^*]+)\*/g, function(match, content) {
        return '<em>' + content + '</em>';
    });

    // 6. 删除线
    html = html.replace(/~~([^~]+)~~/g, function(match, content) {
        return '<del>' + content + '</del>';
    });

    // 7. 引用
    html = html.replace(/^&gt;\s?(.*)$/gm, function(match, content) {
        return '<blockquote>' + content + '</blockquote>';
    });

    // 8. 换行转 <br>
    html = html.replace(/\n/g, '<br>');

    return html;
}

async function loadList(key, path) {
    var c = document.getElementById('content');
    var params = new URLSearchParams(window.location.search);
    var item = params.get('item');

    if (item) {
        try {
            var res = await fetch('https://raw.githubusercontent.com/' + REPO_OWNER + '/' + REPO_NAME + '/' + BRANCH + '/' + path + '/' + item);
            if (!res.ok) throw new Error('');
            var text = await res.text();
            c.innerHTML = '<a href="/' + path + '/" class="back-link">← 返回列表</a><div class="doing-content">' + renderContent(text) + '</div>';
        } catch {
            c.innerHTML = '<a href="/' + path + '/" class="back-link">← 返回列表</a><div class="error">加载失败 (ᗜᴗᗜ)</div>';
        }
        return;
    }

    try {
        var res = await fetch('/index.json');
        if (!res.ok) throw new Error('');
        var data = await res.json();
        var files = data[key];
        if (!files || !Array.isArray(files) || files.length === 0) {
            c.innerHTML = '<div class="empty">还没有内容 (ᗜᴗᗜ)</div>';
            return;
        }
        // 直接使用 generate.js 生成的顺序，不重新排序
        var html = '<ul class="list">';
        for (var name of files) {
            html += '<li><a href="?item=' + encodeURIComponent(name + '.txt') + '">' + name + ' <span class="file-icon">.txt</span></a></li>';
        }
        html += '</ul>';
        c.innerHTML = html;
    } catch {
        c.innerHTML = '<div class="error">加载失败 (ᗜᴗᗜ)</div>';
    }
}