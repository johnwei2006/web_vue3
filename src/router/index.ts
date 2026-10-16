import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { storage } from '@/utils/storage';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

// 全局前置守卫：标题设置 + 登录鉴权
router.beforeEach((to) => {
  document.title = (to.meta.title as string) || import.meta.env.VITE_APP_TITLE;
  if (to.meta.requiresAuth && !storage.get('token')) {
    return { name: 'Login', query: { redirect: to.fullPath } };
  }
  return true;
});

export default router;
