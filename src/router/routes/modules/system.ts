import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const SYSTEM: AppRouteRecordRaw = {
  path: '/system',
  name: 'system',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '系统管理',
    icon: 'icon-apps',
    requiresAuth: true,
    roles: ['admin'],
    order: 7,
  },
  children: [
    {
      path: 'config',
      name: 'configList',
      component: () => import('@/views/system/config/index.vue'),
      meta: {
        locale: '参数设置',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
    {
      path: 'operationLog',
      name: 'operationLogList',
      component: () => import('@/views/system/operation-log/index.vue'),
      meta: {
        locale: '操作日志',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
    {
      path: 'loginLog',
      name: 'loginLogList',
      component: () => import('@/views/system/login-log/index.vue'),
      meta: {
        locale: '登录日志',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
    {
      path: 'online',
      name: 'onlineList',
      component: () => import('@/views/system/online/index.vue'),
      meta: {
        locale: '在线用户',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
  ],
};

export default SYSTEM;
