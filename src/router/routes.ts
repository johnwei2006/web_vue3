import type { RouteRecordRaw } from 'vue-router';
import Layout from '@/layouts/index.vue';

/** 路由表：集中维护，支持 meta 权限与懒加载 */
export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', requiresAuth: false },
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页', requiresAuth: true, roles: ['admin', 'user'] },
      },
      {
        path: 'devices',
        name: 'Devices',
        component: () => import('@/views/devices/index.vue'),
        meta: { title: '设备管理', requiresAuth: true, roles: ['admin', 'user'] },
      },
      {
        path: 'devices/:id',
        name: 'DeviceDetail',
        component: () => import('@/views/devices/detail.vue'),
        meta: { title: '设备详情', requiresAuth: true, roles: ['admin', 'user'] },
      },
      {
        path: 'alarms',
        name: 'Alarms',
        component: () => import('@/views/alarms/index.vue'),
        meta: { title: '告警看板', requiresAuth: true, roles: ['admin', 'user'] },
      },
      {
        path: 'data',
        name: 'Data',
        component: () => import('@/views/data/index.vue'),
        meta: { title: '数据查询', requiresAuth: true, roles: ['admin', 'user'] },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '页面不存在', requiresAuth: false },
  },
];
