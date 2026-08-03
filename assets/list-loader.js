var REPO_OWNER = 'annochqwq';
var REPO_NAME = 'annochqwq.github.io';
var BRANCH = 'main';

function renderContent(text) {
    var html = text;
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    html = html.replace(/```([\s\S]*?)```/g, function(match, code) {
        var escaped = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return '<pre><code>' + escaped + '</code></pre>';
    });
    html = html.replace(/^&gt;\s?(.*)$/gm, '<blockquote>$1</blockquote>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
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
        files.sort().reverse();
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