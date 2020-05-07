<template>
	<el-container class="home_container">
		<!-- 头部 -->
		<el-header>
			<h3>网上服装商城系统</h3>
			<!-- <h4>个人信息</h4> -->
			<div>
				<p>用户名: {{$store.state.userInfo.userName}}</p>
				<el-button type="info" @click="goHome">返回商城</el-button>
				<el-button type="info" @click="logout">退出登录</el-button>
			</div>
		</el-header>
		<!-- 侧边栏菜单 -->
		<el-container>
			<el-aside :width="isCollapse ? '56px' : '200px' ">
				<div class="toggle_btn" @click="toggleCollapse">| | |</div>
				<el-menu background-color="#323744" text-color="#FFF" active-text-color="#409EFF" router :default-active="$route.path"
				 unique-opened :collapse="isCollapse" :collapse-transition="false">

					<el-menu-item index="/userhome/profile">
						<template slot="title">
							<i class="el-icon-menu"></i>
							<span>个人信息</span>
						</template>
					</el-menu-item>

					<el-menu-item index="/userhome/orders">
						<template slot="title">
							<i class="el-icon-menu"></i>
							<span>订单列表</span>
						</template>
					</el-menu-item>

					</el-menu>
				</el-aside>
				<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	import {
		ADD_USER_NAME,
		ADD_USER_INFO,
		REMOVE_USER_NAME
	} from 'store/mutation-types'
	import {
		isUser,
		userLogout
	} from 'network/user'
	export default {
		name: 'UserHome',
		data() {
			return {
				userName: '',
				isCollapse: false
			}
		},
		async created() {
			//设置访问权限
			let result = await isUser();
			if (result.status_code !== 400) {
				this.$store.commit(ADD_USER_NAME, {
					userName: result.userName
				});
				this.$store.commit(ADD_USER_INFO, {
					userInfo: result.userInfo,
				});
			} else {
				this.$msgbox({
					type: 'info',
					message: "请先登录!",
					showClose: true,
				});
				this.$router.replace('/userlogin');
			}
		},
		methods: {
			//退出登录
			async logout() {
				let result = await userLogout();
				this.$message({
					showClose: true,
					message: result.message,
					type: 'info'
				});
				this.$store.commit(REMOVE_USER_NAME);
				this.$router.replace('/home')
			},
			//返回商城首页
			goHome() {
				this.$router.replace('/home')
			},
			//菜单栏伸缩
			toggleCollapse() {
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

	.toggle_btn {
		text-align: center;
		line-height: 24px;
		color: #fff;
		background-color: #485164;
		cursor: pointer;
	}
</style>
