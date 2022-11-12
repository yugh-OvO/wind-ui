import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const MEMBER: AppRouteRecordRaw = {
  path: '/member',
  name: 'member',
  component: DEFAULT_LAYOUT,
  redirect: '/member/list',
  meta: {
    locale: '用户列表',
    icon: 'icon-user',
    requiresAuth: true,
    roles: ['admin'],
    hideChildrenInMenu: true,
    order: 1,
  },
  children: [
    {
      path: 'list',
      name: 'memberList',
      component: () => import('@/views/member/index.vue'),
      meta: {
        requiresAuth: true,
        roles: ['admin'],
        activeMenu: 'member',
      },
    },
  ],
};

export default MEMBER;
