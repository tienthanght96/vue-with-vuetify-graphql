import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import AuthGuard from './AuthGuard';

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/posts',
      name: 'posts',
      component: () => import('./views/Posts.vue')
    },
    {
      path: '/posts/:postId',
      name: 'post',
      component: () => import('./views/Post.vue'),
      props: true
    },
    {
      path: '/post/add',
      name: 'addpost',
      component: () => import('./views/AddPost.vue'),
      beforeEnter: AuthGuard,
    },
    {
      path: '/signin',
      name: 'signin',
      component: () => import('./views/SignIn.vue'),
      
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('./views/SignUp.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('./views/Profile.vue'),
      beforeEnter: AuthGuard,
    },
  ]
})
