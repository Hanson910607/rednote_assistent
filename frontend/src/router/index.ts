import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/copywriter',
    name: 'Copywriter',
    component: () => import('../views/Copywriter.vue'),
  },
  {
    path: '/topic-selector',
    name: 'TopicSelector',
    component: () => import('../views/TopicSelector.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../views/History.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.afterEach((to, from) => {
  if (to.path !== from.path) {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }
});

export default router;
