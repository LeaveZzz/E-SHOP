import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import('views/home/Home')
const UserLogin = () => import('views/userLogin/UserLogin')
const UserRegister = () => import('views/userRegister/UserRegister')
//管理员相关路由
const AdminLogin = () => import('views/adminLogin/AdminLogin')
const AdminHome = () => import('views/adminHome/AdminHome')
const Welcome = () => import('views/adminHome/children/Welcome')
const UserList = () => import('views/adminHome/children/UserList')
const GoodsList = () => import('views/adminHome/children/GoodsList')
const AddGoods = () => import('views/adminHome/children/AddGoods')
const OrdersList = () => import('views/adminHome/children/OrdersList')
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
			showHeaderTop: true
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
		},{
			path: 'users',
			component: UserList
		},
		,{
			path: 'goodslist',
			component: GoodsList
		},
		,{
			path: 'addgoods',
			component: AddGoods
		},
		,{
			path: 'orderslist',
			component: OrdersList
		},
		,{
			path: 'datalist',
			component: DataList
		}]
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
