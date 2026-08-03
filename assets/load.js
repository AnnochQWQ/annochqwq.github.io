// 加载导航
fetch('/nav.json')
    .then(res => res.json())
    .then(data => {
        var nav = document.getElementById('nav-placeholder');
        var html = '<nav class="nav">';
        var currentPath = window.location.pathname;
        for (var item of data) {
            var isActive = currentPath.includes('/' + item.path + '/') ? ' class="active"' : '';
            html += '<a href="/' + item.path + '/"' + isActive + '>' + item.title + '</a>';
        }
        html += '</nav>';
        nav.innerHTML = html;
    });