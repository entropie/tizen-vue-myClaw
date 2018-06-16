// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'

import App from './App'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
      isAmbient: false,
      hr: 123
  },
  mutations: {
  }
})



Vue.config.productionTip = false

new Vue({
    store,
    render: h => h(App)
}).$mount('#app')
