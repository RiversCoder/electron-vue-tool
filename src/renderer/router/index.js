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
      redirect: '/container/media-tool',
      children:[,{
        path:'/container/media-tool',
        name: 'media-tool',
        component: () => import('@/pages/container/container-pages/media-tool/index.vue')
      },{
        path:'/container/toutiao-svideo',
        name: 'toutiao-svideo',
        component: () => import('@/pages/container/container-pages/toutiao-svideo/toutiao-svideo.vue')
      },{
        path:'/container/toutiao-svideo-author',
        name: 'toutiao-svideo-author',
        component: () => import('@/pages/container/container-pages/toutiao-svideo-author/index.vue')
      },{
        path:'/container/douyin-svideo-author',
        name: 'douyin-svideo-author',
        component: () => import('@/pages/container/container-pages/douyin-svideo-author/index.vue')
      },{
        path:'/container/qutoutiao-svideo-author',
        name: 'qutoutiao-svideo-author',
        component: () => import('@/pages/container/container-pages/qutoutiao-svideo-author/index.vue')
      },{
        path:'/container/taobao-tool',
        name: 'taobao-tool',
        component: () => import('@/pages/container/container-pages/taobao-tool/index.vue')
      }]
    },
    {
      path: '/',
      redirect: '/container'
    }
  ]
})
