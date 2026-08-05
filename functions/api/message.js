export async function onRequest(context) {
    const db = context.env.DB;

    if (context.request.method === 'GET') {
        try {
            const result = await db.prepare(
                'SELECT id, nickname, content, datetime(created_at, \'+8 hours\') as created_at FROM messages ORDER BY created_at DESC LIMIT 100'
            ).all();
            return new Response(JSON.stringify(result.results), {
                headers: { 'Content-Type': 'application/json' }
            });
        } catch {
            return new Response(JSON.stringify({ error: '查询失败' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }

    if (context.request.method === 'POST') {
        try {
            const body = await context.request.json();
            const { nickname, content } = body;
            if (!nickname || !content || nickname.length > 20 || content.length > 500) {
                return new Response(JSON.stringify({ error: '参数错误' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            await db.prepare(
                'INSERT INTO messages (nickname, content) VALUES (?, ?)'
            ).bind(nickname, content).run();
            return new Response(JSON.stringify({ success: true }), {
                headers: { 'Content-Type': 'application/json' }
            });
        } catch {
            return new Response(JSON.stringify({ error: '提交失败' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }

    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
    });
}