// GitHub OAuth 第二步：用授权码换取 access token，并通过 postMessage 把结果回传给后台。
// 由 Cloudflare Pages Functions 在 /callback 路径处理。
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const provider = 'github';

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookie = request.headers.get('Cookie') || '';
  const savedState = /(?:^|;\s*)oauth_state=([^;]+)/.exec(cookie)?.[1];

  if (!code || !state || !savedState || state !== savedState) {
    return renderMessage(provider, 'error', '登录状态校验失败，请重试。');
  }

  let data;
  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'anchor-blog-cms',
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    data = await res.json();
  } catch (e) {
    return renderMessage(provider, 'error', '获取 token 失败：' + e.message);
  }

  if (data.error || !data.access_token) {
    return renderMessage(provider, 'error', data.error_description || data.error || '未能获取 token');
  }

  return renderMessage(provider, 'success', { token: data.access_token, provider });
}

// 返回一个 HTML 页面，按 Decap/Sveltia CMS 约定的握手协议把结果发回打开它的后台窗口。
function renderMessage(provider, status, result) {
  const content = `authorization:${provider}:${status}:${JSON.stringify(result)}`;
  const body = `<!doctype html><html><head><meta charset="utf-8"></head><body>
<p style="font-family:sans-serif">登录处理中，请稍候…</p>
<script>
(function () {
  function receiveMessage(e) {
    window.opener.postMessage(${JSON.stringify(content)}, e.origin);
    window.removeEventListener('message', receiveMessage, false);
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener && window.opener.postMessage('authorizing:${provider}', '*');
})();
</script>
</body></html>`;
  return new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'text/html;charset=UTF-8' },
  });
}
