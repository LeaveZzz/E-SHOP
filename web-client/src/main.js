import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false

//图片懒加载
import LazyLoad from 'vue-lazyload'
Vue.use(LazyLoad, {
  error:require('./assets/img/error.png'),
  // 占位图
  loading:require('./assets/img/loading.png')
})

//引入ElementUI库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

//省市区联动
import VueAreaLinkage from 'vue-area-linkage';
import 'vue-area-linkage/dist/index.css';
Vue.use(VueAreaLinkage);

//引入图标库
import 'assets/fonts/iconfont.css'

//引入全局样式
import 'assets/css/base.css'

//事件总线
Vue.prototype.$bus = new Vue();

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
