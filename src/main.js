import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import '@/assets/styles/main.scss'
import './config/prototypes'
import i18n from './plugins/i18n'

Vue.config.productionTip = false

new Vue({
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')