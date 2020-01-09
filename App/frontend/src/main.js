import Vue from 'vue'
import App from './App'
import router from './router'

import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { Icon }  from 'leaflet'
import 'leaflet/dist/leaflet.css'

import socketio from 'socket.io-client';
import VueSocketio from 'vue-socket.io';

library.add(faUserSecret);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(VueSidebarMenu);

const VueScrollTo = require('vue-scrollto');
Vue.use(VueScrollTo);
// Scroll default options
Vue.use(VueScrollTo, {
     container: "body",
     duration: 500,
     easing: "ease",
     offset: -500,
     force: true,
     cancelable: true,
     onStart: false,
     onDone: false,
     onCancel: false,
     x: true,
     y: true
 });

Vue.config.productionTip = false;

//Websocket stuff
export const SocketInstance = socketio('http://localhost:5000');
Vue.use(VueSocketio,SocketInstance);


// this part resolve an issue where the markers would not appear
delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

//Websocket stuff
export const SocketInstance = socketio('http://localhost:5000');
Vue.use(VueSocketio,SocketInstance);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
