import Vue from 'vue'
import Router from 'vue-router'
import Base from '@/routes/Base'
import Map from '@/components/Map'
import Grid from '@/components/Grid'

Vue.use(Router)

export default new Router({
  routes: [
    { 
      path: '/',
      redirect: '/info',
      name: 'Base',
      component: Base,
      children: [
      {
        path: 'map',
        name: 'Map',
        component: Map
      },
      {
        path: 'info',
        name: 'Info',
        component: Grid
      }
    ]
    }
  ]
})
