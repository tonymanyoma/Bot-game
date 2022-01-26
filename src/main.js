import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as VueGoogleMaps from "vue2-google-maps";
import Vuesax from 'vuesax'

import 'vuesax/dist/vuesax.css' 
import 'material-icons/iconfont/material-icons.css';

Vue.use(Vuesax)

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyC56ghdXlGofJmVPi43_2j5JJwAhqcX4Ro",
    libraries: "places" // necessary for places input
  }
});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
