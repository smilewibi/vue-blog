import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/Home.vue'),
  },
  {
    path: '/blogs',
    name: 'Blogs',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/Blogs.vue'),
  },
  {
    path: '/blog/:id',
    name: 'Blog',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/Blog.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
