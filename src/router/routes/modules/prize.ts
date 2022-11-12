import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const QUESTION: AppRouteRecordRaw = {
  path: '/prize',
  name: 'prize',
  component: DEFAULT_LAYOUT,
  redirect: '/prize/list',
  meta: {
    locale: '奖品管理',
    icon: 'icon-gift',
    requiresAuth: true,
    roles: ['admin'],
    hideChildrenInMenu: true,
    order: 4,
  },
  children: [
    {
      path: 'list',
      name: 'prizeList',
      component: () => import('@/views/prize/index.vue'),
      meta: {
        requiresAuth: true,
        roles: ['admin'],
        activeMenu: 'prize',
      },
    },
  ],
};

export default QUESTION;
