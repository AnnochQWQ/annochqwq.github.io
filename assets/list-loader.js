// 仓库信息已移至 Cloudflare Functions 环境变量

function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderContent(text) {
    var html = text;
    html = html.replace(/```\s*\n([\s\S]*?)\n\s*```/g, function(match, code) {
        return '<pre><code>' + escapeHtml(code) + '</code></pre>';
    });
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function(match, alt, src) {
        return '<img src="' + escapeHtml(src) + '" alt="' + escapeHtml(alt) + '">';
    });
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(match, text, url) {
        return '<a href="' + escapeHtml(url) + '" target="_blank">' + escapeHtml(text) + '</a>';
    });
    html = html.replace(/\*\*([^*]+)\*\*/g, function(match, content) {
        return '<strong>' + content + '</strong>';
    });
    html = html.replace(/\*([^*]+)\*/g, function(match, content) {
        return '<em>' + content + '</em>';
    });
    html = html.replace(/~~([^~]+)~~/g, function(match, content) {
        return '<del>' + content + '</del>';
    });
    html = html.replace(/^&gt;\s?(.*)$/gm, function(match, content) {
        return '<blockquote>' + content + '</blockquote>';
    });
    html = html.replace(/\n/g, '<br>');
    return html;
}

async function loadList(key, path) {
    var c = document.getElementById('content');
    var params = new URLSearchParams(window.location.search);
    var item = params.get('item');

    if (item) {
        try {
            var res = await fetch('/api/content?path=' + path + '/' + item);
            if (!res.ok) throw new Error('');
            var text = await res.text();

            var html = '<a href="/' + path + '/" class="back-link">← 返回列表</a>';
            var title = item.replace('.txt', '');
            html += '<h1 style="margin-bottom:16px;">' + escapeHtml(title) + '</h1>';
            html += '<div class="doing-content">' + renderContent(text) + '</div>';
            c.innerHTML = html;
        } catch {
            c.innerHTML = '<a href="/' + path + '/" class="back-link">← 返回列表</a><div class="error">加载失败</div>';
        }
        return;
    }

    try {
        var res = await fetch('/index.json');
        if (!res.ok) throw new Error('');
        var data = await res.json();
        var files = data[key];
        if (!files || !Array.isArray(files) || files.length === 0) {
            c.innerHTML = '<div class="empty">还没有内容</div>';
            return;
        }
        var html = '<ul class="list">';
        for (var f of files) {
            var name = f.name || f;
            html += '<li><a href="?item=' + encodeURIComponent(f.nameWithExt || name + '.txt') + '">' + escapeHtml(name) + ' <span class="file-icon">.txt</span></a></li>';
        }
        html += '</ul>';
        c.innerHTML = html;
    } catch {
        c.innerHTML = '<div class="error">加载失败</div>';
    }
}