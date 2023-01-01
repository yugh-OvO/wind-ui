import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const PROFILE: AppRouteRecordRaw = {
  path: '/profile',
  name: 'profile',
  component: DEFAULT_LAYOUT,
  redirect: '/profile/list',
  meta: {
    locale: '个人信息',
    icon: 'icon-file',
    requiresAuth: false,
    hideInMenu: true,
    order: 9,
  },
  children: [
    {
      path: 'list',
      name: 'profileList',
      component: () => import('@/views/common/profile/index.vue'),
      meta: {
        requiresAuth: false,
        hideInMenu: true,
        activeMenu: 'profile',
      },
    },
  ],
};

export default PROFILE;
