<template>
	<el-container class="home_container">
		<!-- 头部 -->
		<el-header>
			<h3>糕糕商城</h3>
			<h4>欢迎来到后台管理界面</h4>
			<div>
				<p>管理员: {{$store.state.adminName}}</p>
				<el-button type="info" @click="goHome">返回商城</el-button>
				<el-button type="info" @click="logout">退出登录</el-button>
			</div>
		</el-header>
		<!-- 侧边栏菜单 -->
		<el-container>
			<el-aside :width="isCollapse ? '56px' : '200px' ">
				<div class="toggle_btn" @click="toggleCollapse">| | |</div>
				<el-menu background-color="#323744" text-color="#FFF" active-text-color="#409EFF" router :default-active="$route.path" unique-opened :collapse="isCollapse" :collapse-transition="false">
					<!-- 一级菜单 用户管理 -->
					<el-submenu index="1">
						<!-- 模板 -->
						<template slot="title">
							<i class="iconfont icon-users"></i>
							<span>用户管理</span>
						</template>
						<!-- 二级菜单 -->
						<el-menu-item index="/adminhome/users">
							<template slot="title">
								<i class="el-icon-menu"></i>
								<span>用户列表</span>
							</template>
						</el-menu-item>
					</el-submenu>

					<!-- 一级菜单 商品管理-->
					<el-submenu index="2">
						<template slot="title">
							<i class="iconfont icon-shangpin"></i>
							<span>商品管理</span>
						</template>
						<el-menu-item index="/adminhome/goodslist">
							<template slot="title">
								<i class="el-icon-menu"></i>
								<span>商品列表</span>
							</template>
						</el-menu-item>
						<el-menu-item index="/adminhome/addgoods">
							<template slot="title">
								<i class="el-icon-menu"></i>
								<span>商品上架</span>
							</template>
						</el-menu-item>
					</el-submenu>

					<!-- 一级菜单 订单管理-->
					<el-submenu index="3">
						<template slot="title">
							<i class="iconfont icon-danju"></i>
							<span>订单管理</span>
						</template>
						<el-menu-item index="/adminhome/orderslist">
							<template slot="title">
								<i class="el-icon-menu"></i>
								<span>订单列表</span>
							</template>
						</el-menu-item>
					</el-submenu>

					<!-- 一级菜单 数据统计-->
					<el-submenu index="4">
						<template slot="title">
							<i class="iconfont icon-baobiao"></i>
							<span>数据统计</span>
						</template>
						<el-menu-item index="/adminhome/datalist">
							<template slot="title">
								<i class="el-icon-menu"></i>
								<span>数据列表</span>
							</template>
						</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-aside>
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	import {ADD_ADMIN_NAME} from 'store/mutation-types'
	import {
		isAdmin,
		adminLogout
	} from 'network/admin'
	export default {
		name: 'AdminHome',
		data() {
			return {
				adminName: '',
				isCollapse: false
			}
		},
		async created() {
			//设置访问权限
			let result = await isAdmin();
			if (result.status_code === 400) {
				this.$msgbox({
					showClose: true,
					message: result.message,
					type: 'info'
				});
				return this.$router.replace('/adminlogin')
			}
			this.$store.commit(ADD_ADMIN_NAME,{adminName:result.adminName});
		},
		methods: {
			//退出登录
			async logout() {
				let result = await adminLogout();
				this.$message({
					showClose: true,
					message: result.message,
					type: 'info'
				});
				this.$router.replace('/home')
			},
			//返回商城首页
			goHome() {
				this.$router.replace('/home')
			},
			//菜单栏伸缩
			toggleCollapse(){
				this.isCollapse = !this.isCollapse
			}
		}
	}
</script>

<style scoped>
	.el-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0;
		color: #EEEEEE;
		background-color: #343A40;
	}

	.el-header h3 {
		width: 200px;
		height: 100%;
		text-align: center;
		line-height: 60px;
		background-color: #272B30;
	}

	.el-header>div {
		display: flex;
		align-items: center;
		padding-right: 20px;
	}

	.el-header>div>p {
		padding-right: 20px;
	}

	.el-aside {
		background-color: #323744;
		transition: width .2s;
	}

	.el-aside>.el-menu {
		border-right: none;
	}

	.el-main {
		background-color: #EAEDF1;
	}

	.home_container {
		height: 100%;
		width: 100%;
	}

	.iconfont {
		margin-right: 10px;
	}
	
	.toggle_btn{
		text-align: center;
		line-height: 24px;
		color: #fff;
		background-color: #485164;
		cursor: pointer;
	}
</style>
