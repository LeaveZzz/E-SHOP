import Vue from 'vue'
import App from './App.vue'
import router from '../router/index'
import store from './store'

Vue.config.productionTip = false

//引入ElementUI库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
