import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/dashboard',
  name: 'dashboard',
  component: DEFAULT_LAYOUT,
  redirect: '/dashboard/workplace',
  meta: {
    locale: '工作台',
    requiresAuth: true,
    icon: 'icon-dashboard',
    hideChildrenInMenu: true,
    order: 0,
  },
  children: [
    {
      path: 'workplace',
      name: 'Workplace',
      component: () => import('@/views/dashboard/workplace/index.vue'),
      meta: {
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'dashboard',
      },
    },
  ],
};

export default DASHBOARD;
