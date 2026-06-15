// GitHub OAuth 第一步：把用户重定向到 GitHub 授权页。
// 由 Cloudflare Pages Functions 在 /auth 路径处理。
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const clientId = env.GITHUB_CLIENT_ID;
  if (!clientId || !env.GITHUB_CLIENT_SECRET) {
    return new Response(
      'OAuth 未配置：请在 Cloudflare Pages 的环境变量里设置 GITHUB_CLIENT_ID 和 GITHUB_CLIENT_SECRET。',
      { status: 500, headers: { 'Content-Type': 'text/plain;charset=UTF-8' } },
    );
  }

  const state = crypto.randomUUID();
  const redirectUri = `${url.origin}/callback`;

  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', clientId);
  authorize.searchParams.set('redirect_uri', redirectUri);
  authorize.searchParams.set('scope', 'repo,user');
  authorize.searchParams.set('state', state);

  const headers = new Headers({ Location: authorize.toString() });
  headers.append(
    'Set-Cookie',
    `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
  );
  return new Response(null, { status: 302, headers });
}
