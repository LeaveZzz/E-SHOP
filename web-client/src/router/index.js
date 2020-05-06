import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import('views/home/Home')
const UserLogin = () => import('views/userLogin/UserLogin')
const UserRegister = () => import('views/userRegister/UserRegister')
const SearchGoods = () => import('views/searchGoods/SearchGoods')
const GoodsDetail = () => import('views/goodsDetail/GoodsDetail')
const Cart = () => import('views/cart/Cart')
//管理员相关路由
const AdminLogin = () => import('views/adminLogin/AdminLogin')
const AdminHome = () => import('views/adminHome/AdminHome')
const Welcome = () => import('views/adminHome/children/Welcome')
const UserList = () => import('views/adminHome/children/UserList')
const AdminList = () => import('views/adminHome/children/AdminList')
const GoodsList = () => import('views/adminHome/children/GoodsList')
const CategoryList = () => import('views/adminHome/children/CategoryList')
const OrderList = () => import('views/adminHome/children/OrderList')
const DataList = () => import('views/adminHome/children/DataList')

const NotFound = () => import('views/notfound/NotFound')

Vue.use(VueRouter)

const routes = [{
		path: '/',
		redirect: '/home'
	},
	{
		path: '/home',
		component: Home,
		meta: {
			showHeaderTop: true,
			showHeaderSearch: true
		}
	},
	{
		path: '/userlogin',
		component: UserLogin
	},
	{
		path: '/userreg',
		component: UserRegister
	},
	{
		path: '/adminlogin',
		component: AdminLogin
	}, {
		path: '/adminhome',
		component: AdminHome,
		redirect: '/adminhome/welcome',
		children: [{
			path: 'welcome',
			component: Welcome
		}, {
			path: 'users',
			component: UserList
		}, {
			path: 'administrators',
			component: AdminList
		}, {
			path: 'goodslist',
			component: GoodsList
		}, {
			path: 'categorylist',
			component: CategoryList
		}, , {
			path: 'orderlist',
			component: OrderList
		}, , {
			path: 'datalist',
			component: DataList
		}]
	},
	{
		path: '/searchgoods',
		component: SearchGoods,
		meta: {
			showHeaderTop: true,
			showHeaderSearch: true
		}
	},
	{
		path: '/goodsdetail',
		component: GoodsDetail,
		meta: {
			showHeaderTop: true,
		}
	},
	{
	  path: '/cart',
	  component: Cart,
	  meta: {showHeaderTop: true}
	},
	{
		path: '/notfound',
		component: NotFound
	}
]

const router = new VueRouter({
	mode: 'history',
	routes
})

router.beforeEach((to, from, next) => {
	if (to.matched.length === 0) {
		//路由不存在则跳转到自定义404页面
		next('/notfound');
	} else {
		next();
	}
})

export default router
