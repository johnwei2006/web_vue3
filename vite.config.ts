import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { viteMockServe } from 'vite-plugin-mock';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 开发环境模拟接口：vite-plugin-mock 仅在 dev（serve）加载，生产构建不注入
    viteMockServe({ mockPath: 'mock' }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      // 开发环境接口代理：将 /api 转发到后端服务
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // 登录与用户信息接口由 vite-plugin-mock 在 dev 拦截，跳过代理避免转发到未启动的后端；
        // 其余 /api 路由仍正常代理到 localhost:3000 进行真实联调
        bypass(req) {
          const url = req.url || '';
          if (url === '/api/user/login' || url === '/api/user/info') {
            return false;
          }
        },
      },
    },
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
  },
});
