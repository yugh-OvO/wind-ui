import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const QUESTION: AppRouteRecordRaw = {
  path: '/question',
  name: 'question',
  component: DEFAULT_LAYOUT,
  redirect: '/question/list',
  meta: {
    locale: '问答设置',
    icon: 'icon-question-circle',
    requiresAuth: true,
    roles: ['admin'],
    hideChildrenInMenu: true,
    order: 3,
  },
  children: [
    {
      path: 'list',
      name: 'questionList',
      component: () => import('@/views/question/index.vue'),
      meta: {
        requiresAuth: true,
        roles: ['admin'],
        activeMenu: 'question',
      },
    },
  ],
};

export default QUESTION;
