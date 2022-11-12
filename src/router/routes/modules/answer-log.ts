import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const ANSWERLOG: AppRouteRecordRaw = {
  path: '/answer-log',
  name: 'answerLog',
  component: DEFAULT_LAYOUT,
  redirect: '/answer-log/list',
  meta: {
    locale: '回答记录',
    icon: 'icon-bulb',
    requiresAuth: true,
    roles: ['admin'],
    hideChildrenInMenu: true,
    order: 4,
  },
  children: [
    {
      path: 'list',
      name: 'answerLogList',
      component: () => import('@/views/answer-log/index.vue'),
      meta: {
        requiresAuth: true,
        roles: ['admin'],
        activeMenu: 'answerLog',
      },
    },
  ],
};

export default ANSWERLOG;
