export async function onRequest(context) {
    const url = new URL(context.request.url);
    const path = url.searchParams.get('path');
    if (!path) {
        return new Response('缺少路径参数', { status: 400 });
    }
    const token = context.env.GITHUB_TOKEN;
    const apiUrl = `https://api.github.com/repos/AnnochQWQ/annochqwq.github.io/contents/${path}`;
    // 返回请求的 URL 用于调试
    return new Response('请求的 URL: ' + apiUrl, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
}