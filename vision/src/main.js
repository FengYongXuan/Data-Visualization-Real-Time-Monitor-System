import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
// 引入全局的样式文件
import './assets/css/global.less'
// 引入字体的文件
import './assets/font/iconfont.css'
import SocketService from './utils/socket_service'
// 对服务端进行websocket的连接
SocketService.Instance.connect()
// 其它组件可通过this.$socket来调用
Vue.prototype.$socket = SocketService.Instance

// 请求基准路径的配置
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/'
// 将axios挂载到Vue的原型对象上，在别的组件中就可以通过this.$http获取axios对象
Vue.prototype.$http = axios

// 将全局的echarts对象挂载到Vue的原型对象上
// 别的组件可用this.$echarts来获取echarts对象
Vue.prototype.$echarts = window.echarts

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
