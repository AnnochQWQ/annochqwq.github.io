fetch('/_shared/header.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('nav-placeholder').innerHTML = html;
        var links = document.querySelectorAll('.nav a');
        var current = window.location.pathname;
        links.forEach(function(link) {
            var href = link.getAttribute('href');
            if (current.includes(href) && href !== '/') {
                link.classList.add('active');
            }
            if (href === '/' && current === '/') {
                link.classList.add('active');
            }
        });
    });