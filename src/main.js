import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap/dist/css/bootstrap.css'
import Vue from 'vue'
import VuePapaParse from 'vue-papa-parse'
import App from './App.vue'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VuePapaParse)

Vue.config.productionTip = false

new Vue({
  render: (h) => h(App),
}).$mount('#app')
