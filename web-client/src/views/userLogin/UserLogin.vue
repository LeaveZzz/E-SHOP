<template>
	<div class="user_login">
		<div class="login_box">
			<!-- logo盒子 -->
			<div class="logo_box">
				<img src="~assets/img/logo.svg" alt="">
			</div>
			<!-- 表单盒子 -->
			<el-form class="login_form" :model="userLogin_form">
				<!-- 用户名 -->
				<el-form-item>
					<el-input v-model="userLogin_form.userName" prefix-icon="iconfont icon-user" placeholder="请输入用户名" clearable></el-input>
				</el-form-item>
				<!-- 密码 -->
				<el-form-item>
					<el-input v-model="userLogin_form.userPsw" prefix-icon="iconfont icon-3702mima" placeholder="请输入密码" show-password></el-input>
				</el-form-item>
				<!-- 按钮 -->
				<el-form-item class="btns">
					<el-button type="primary">登录</el-button>
					<el-button type="info">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'UserLogin',
		data() {
			return {
				userLogin_form: {
					userName: '',
					userPsw: ''
				}
			}
		},
	}
</script>

<style scoped>
	.user_login {
		background-color: #2b4b6b;
		height: 100%;
	}

	.login_box {
		width: 450px;
		height: 300px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 5px;
		background-color: #F2F2F2;
	}

	.logo_box {
		width: 130px;
		height: 130px;
		position: absolute;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;
		border: 1px solid #eee;
		box-shadow: 0 0 10px #ddd;
		border-radius: 50%;
		padding: 10px;
	}

	.logo_box img {
		width: 100%;
		height: 100%;
		background-color: #eee;
		border-radius: 50%;
	}

	.login_form {
		width: 100%;
		position: absolute;
		bottom: 0;
		padding: 20px;
	}

	.btns {
		display: flex;
		justify-content: center;
	}
</style>
