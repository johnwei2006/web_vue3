import type { MockMethod } from 'vite-plugin-mock';

/**
 * 预置测试账号（仅用于开发环境 mock 登录，生产走真实后端）
 * - admin / 123456  -> roles: ['admin']
 * - user  / 123456  -> roles: ['user']
 */
const ACCOUNTS: Record<string, { id: number; name: string; password: string; roles: string[] }> = {
  admin: { id: 1, name: '管理员', password: '123456', roles: ['admin'] },
  user: { id: 2, name: '普通用户', password: '123456', roles: ['user'] },
};

// token 直接编码用户名，便于 /user/info 无状态反查角色，无需服务端会话
const encodeToken = (username: string) => Buffer.from(username, 'utf8').toString('base64');

export default [
  {
    url: '/api/user/login',
    method: 'post',
    response: ({ body }: { body: { username?: string; password?: string } }) => {
      const username = (body?.username ?? '').trim();
      const password = body?.password ?? '';
      const account = ACCOUNTS[username];
      if (account && account.password === password) {
        return { code: 0, message: 'ok', data: encodeToken(username) };
      }
      return { code: 401, message: '用户名或密码错误' };
    },
  },
  {
    url: '/api/user/info',
    method: 'get',
    response: ({ headers }: { headers: Record<string, string> }) => {
      const auth = headers?.authorization ?? headers?.Authorization ?? '';
      const token = auth.replace(/^Bearer\s+/i, '');
      let username = '';
      try {
        username = Buffer.from(token, 'base64').toString('utf8');
      } catch {
        username = '';
      }
      const account = ACCOUNTS[username];
      if (!account) {
        return { code: 401, message: '未授权或登录已过期' };
      }
      return {
        code: 0,
        message: 'ok',
        data: { id: account.id, name: account.name, roles: account.roles },
      };
    },
  },
] as MockMethod[];
