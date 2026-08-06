export async function onRequest(context) {
    const url = new URL(context.request.url);
    const path = url.searchParams.get('path');
    if (!path) {
        return new Response('缺少路径参数', { status: 400 });
    }
    const token = context.env.GITHUB_TOKEN;
    const apiUrl = `https://api.github.com/repos/AnnochQWQ/annoch-site/contents/${path}`;
    const res = await fetch(apiUrl, {
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3.raw',
            'User-Agent': 'Cloudflare-Pages'
        }
    });
    if (!res.ok) {
        return new Response('GitHub API 错误: ' + res.status, { status: 404 });
    }
    const text = await res.text();
    return new Response(text, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
}