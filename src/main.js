// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueLazyLoad from 'vue-lazyload'
import VeeValidate, {Validator} from 'vee-validate'
import {dict} from './common/js/messages.js'

Vue.config.productionTip = false

Vue.use(require('vue-wechat-title'))

Vue.use(VueLazyLoad, {
  loading: require('./common/image/newsBg.png')
})

Vue.use(VeeValidate)
Validator.localize('en', dict)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App></App>',
  components: {
    App
  }
})

router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})
