import Vue from 'vue'
const Bus = new Vue()
Vue.prototype.$bus = Bus
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import "./assets/icon/iconfont.css"

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from "element-ui/lib/locale/lang/zh-CN"; // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import echarts from 'echarts' //引入echarts
Vue.prototype.$echarts = echarts //引入组件

import Blob from './excel/Blob'
import Export2Excel from './excel/Export2Excel.js'
import Print from 'vue-print-nb'
Vue.use(Print); //注册
//无限滚动
import vueiInfinite from 'vue-infinite-scroll'
Vue.use(vueiInfinite)

import Print0 from './print/print'

Vue.use(Print0)

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.directive('preventReClick', {
  inserted(el, binding) {
    el.addEventListener('click', () => {
      if (!el.disabled) {
        el.disabled = true
        setTimeout(() => {
          el.disabled = false
        }, binding.value || 2000)
      }
    })
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
