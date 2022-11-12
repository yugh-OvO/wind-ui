import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const WINLOG: AppRouteRecordRaw = {
  path: '/win-log',
  name: 'winLog',
  component: DEFAULT_LAYOUT,
  redirect: '/win-log/list',
  meta: {
    locale: '中奖记录',
    icon: 'icon-archive',
    requiresAuth: true,
    roles: ['admin'],
    hideChildrenInMenu: true,
    order: 6,
  },
  children: [
    {
      path: 'list',
      name: 'winLogList',
      component: () => import('@/views/win-log/index.vue'),
      meta: {
        requiresAuth: true,
        roles: ['admin'],
        activeMenu: 'winLog',
      },
    },
  ],
};

export default WINLOG;
