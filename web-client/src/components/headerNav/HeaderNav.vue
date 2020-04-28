<template>
	<div class="header_nav">
		<p>嗨~欢迎来到糕糕商城</p>
		<ul>
			<li v-if="$store.state.userName">
				<a href="javascript:;">{{'欢迎您 , '+$store.state.userName}}</a>
				<a href="javascript:;" @click="layout">退出登录</a>
			</li>
			<li v-if="!$store.state.userName">
				<router-link to="/userlogin">您好,请登录</router-link>
				<router-link to="/userreg">免费注册</router-link>
			</li>
			<li v-if="$route.path.indexOf('/home') == -1">
				<router-link to="/home">返回首页</router-link>
			</li>
			<li><a>个人中心</a></li>
			<li><a>我的购物车</a></li>
			<li><a @click="goAdmin">管理员通道</a></li>
			<li><a>联系客服</a></li>
			<li><a>网站导航</a></li>
		</ul>
	</div>
</template>

<script>
	import {
		ADD_USER_NAME,
		REMOVE_USER_NAME
	} from 'store/mutation-types'
	import {
		isAdmin
	} from 'network/admin'
	import {
		isUser,
		userLogout
	} from 'network/user'
	export default {
		name: 'HeaderNav',
		data() {
			return {

			}
		},
		async created() {
			//判断用户是否为登录状态
			let result = await isUser();
			if (result.status_code !== 400) {
				this.$store.commit(ADD_USER_NAME, {
					userName: result.userName
				});
			}
		},
		methods: {
			async goAdmin() {
				//验证权限,若是登录状态则直接进入管理员界面,否则进入登录页面
				let result = await isAdmin();
				if (result.status_code !== 400) {
					return this.$router.push('/adminhome')
				} else {
					this.$router.push('/adminlogin');
				}
			},
			//退出登录
			async layout() {
				let result = await userLogout();
				this.$message({
					showClose: true,
					message: result.message,
					type: 'info'
				});
				this.$store.commit(REMOVE_USER_NAME);
			},
		}
	}
</script>

<style scoped>
	/*头部导航*/
	.header_nav {
		width: 100%;
		height: 30px;
		background: #F2F2F2;
		font-family: "Microsoft YaHei";
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.header_nav>div {
		display: flex;
		align-items: center;
	}

	.header_nav>p {
		margin: 0 30px 0 50px;
		color: #999;
		font-size: 15px;
	}

	.locationWrapper {
		position: relative;
		max-width: 100px;

		display: flex;
		align-items: center;

	}

	.locationWrapper .el-cascader {
		position: absolute;
		opacity: 0;
	}

	.locationWrapper .address {
		max-width: 58px;
		font-size: 12px;
		color: #999;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		vertical-align: middle;
	}

	.locationWrapper .icon {
		margin: 0 3px;
		width: 15px;
		height: 15px;
		vertical-align: middle;
	}

	.locationWrapper .icon path {
		fill: #dd6161;
	}

	.header_nav>ul {
		margin: 0 50px;
		list-style: none;

		display: flex;
		align-items: center;
	}

	.header_nav>ul>li:first-child {
		font-size: 14px;
		color: red;
		line-height: 20px;
		cursor: pointer;
	}

	.header_nav>ul>li>a {
		display: inline-block;
		padding: 5px 15px;
		font-size: 12px;
		line-height: 20px;
		color: #999;
		text-decoration: none;
		cursor: pointer;
	}

	.header_nav>ul>li>a:hover {
		color: red;
	}

	.header_nav>ul>li:first-child>a:nth-child(2) {
		padding-left: 0;
		color: red;
	}
</style>
