import Vue from 'vue'
import Router from 'vue-router'
import Base from '@/routes/Base'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Base',
      component: Base
    }
  ]
})
