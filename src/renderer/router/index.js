import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'landing-page',
    //   component: require('@/components/LandingPage').default
    // },
    {
      path: '/container',
      name: 'container',
      component: () => import('@/pages/container/container.vue'),
      redirect: '/container/toutiao-svideo',
      children:[{
        path:'/container/toutiao-svideo',
        name: 'toutiao-svideo',
        component: () => import('@/pages/container/container-pages/toutiao-svideo/toutiao-svideo.vue')
      }]
    },
    {
      path: '/',
      redirect: '/container'
    }
  ]
})
