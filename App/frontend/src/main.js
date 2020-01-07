import Vue from 'vue'
import App from './App'
import router from './router'

import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import socketio from 'socket.io-client';
import VueSocketio from 'vue-socket.io';

library.add(faUserSecret)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(VueSidebarMenu)

Vue.config.productionTip = false

//Websocket stuff
export const SocketInstance = socketio('http://localhost:5000');
Vue.use(VueSocketio,SocketInstance);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
