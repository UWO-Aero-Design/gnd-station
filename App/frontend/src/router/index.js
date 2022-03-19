import Vue from 'vue'
import Router from 'vue-router'
import Base from '@/routes/Base'
import NotFound from '@/routes/NotFound'

Vue.use(Router)

export default new Router({
  routes: [
    { 
      path: '/',
      name: 'Base',
      component: Base,
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})
