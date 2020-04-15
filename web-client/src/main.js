import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false

//引入ElementUI库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

//引入图标库
import 'assets/fonts/iconfont.css'

//引入全局样式
import 'assets/css/base.css'

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

//通过methods里的代码跳转路由需要写下面代码: (不然重复点击会报错)
import Router from 'vue-router'
const routerPush = Router.prototype.replace
Router.prototype.replace = function replace(location) {
  return routerPush.call(this, location).catch(error => error)
}
