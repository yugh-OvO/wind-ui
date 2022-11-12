import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const ORGANIZATION: AppRouteRecordRaw = {
  path: '/organization',
  name: 'organization',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '组织架构',
    icon: 'icon-apps',
    requiresAuth: true,
    roles: ['admin'],
    order: 7,
  },
  children: [
    {
      path: 'user',
      name: 'userList',
      component: () => import('@/views/organization/user/index.vue'),
      meta: {
        locale: '成员管理',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
    {
      path: 'role',
      name: 'roleList',
      component: () => import('@/views/organization/role/index.vue'),
      meta: {
        locale: '角色管理',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
    {
      path: 'menu',
      name: 'menuList',
      component: () => import('@/views/organization/menu/index.vue'),
      meta: {
        locale: '菜单管理',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
  ],
};

export default ORGANIZATION;
