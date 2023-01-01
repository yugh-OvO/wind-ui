import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const article: AppRouteRecordRaw = {
  path: '/article',
  name: 'article',
  component: DEFAULT_LAYOUT,
  redirect: '/article/list',
  meta: {
    locale: '文章管理',
    icon: 'icon-book',
    requiresAuth: true,
    hideChildrenInMenu: true,
    order: 4,
  },
  children: [
    {
      path: 'list',
      name: 'articleList',
      component: () => import('@/views/article/index.vue'),
      meta: {
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'article',
      },
    },
  ],
};

export default article;
