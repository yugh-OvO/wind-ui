import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const OPERATIONLOG: AppRouteRecordRaw = {
  path: '/operation-log',
  name: 'operationLog',
  component: DEFAULT_LAYOUT,
  redirect: '/operation-log/list',
  meta: {
    locale: '操作日志',
    icon: 'icon-file',
    requiresAuth: true,
    roles: ['admin'],
    hideChildrenInMenu: true,
    order: 9,
  },
  children: [
    {
      path: 'list',
      name: 'operationLogList',
      component: () => import('@/views/operation-log/index.vue'),
      meta: {
        requiresAuth: true,
        roles: ['admin'],
        activeMenu: 'operationLog',
      },
    },
  ],
};

export default OPERATIONLOG;
