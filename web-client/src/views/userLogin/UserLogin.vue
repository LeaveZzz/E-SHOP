<template>
	<div class="user_login">
		<div class="login_box">
			<!-- logo盒子 -->
			<div class="logo_box">
				<img src="~assets/img/logo.svg" alt="">
			</div>
			<!-- 返回首页 -->
			<el-button type="text" icon="el-icon-arrow-left" class="backBtn" @click="goHome">返回首页</el-button>
			<!-- 表单盒子 -->
			<el-form class="login_form" :model="userLogin_form" ref="userLogin_form" :rules="userLogin_formRules">
				<!-- 用户名 -->
				<el-form-item prop="userName">
					<el-input v-model="userLogin_form.userName" prefix-icon="iconfont icon-user" placeholder="请输入用户名或邮箱" clearable></el-input>
				</el-form-item>
				<!-- 密码 -->
				<el-form-item prop="userPsw">
					<el-input v-model="userLogin_form.userPsw" prefix-icon="iconfont icon-3702mima" placeholder="请输入密码" show-password></el-input>
				</el-form-item>
				<!-- 按钮 -->
				<el-form-item class="btns">
					<el-button type="primary" @click="userLog">登录</el-button>
					<el-button type="info" @click="resetForm">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import {userLogin} from 'network/user'
	import {ADD_USER_NAME} from 'store/mutation-types'
	export default {
		name: 'UserLogin',
		data() {
			return {
				userLogin_form: {
					userName: '',
					userPsw: ''
				},
				userLogin_formRules:{
					userName: [{
						required: true,
						message: '请输入用户名或邮箱',
						trigger: 'blur'
					}, ],
					userPsw: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}, ]
				}
			}
		},
		methods:{
				//重置表单
				resetForm() {
					this.$refs.userLogin_form.resetFields();
				},
				//返回首页
				goHome() {
					this.$router.push('/home')
				},
				async userLog() {
				this.$refs.userLogin_form.validate(async boolean => {
					if (!boolean) return
					let result = await userLogin(this.userLogin_form)
					if (result.status_code !== 200) {
							this.$msgbox({
								showClose: true,
								message: result.message,
								type: 'error'
							});
						} else {
							this.$msgbox({
								showClose: true,
								message: result.message,
								type: 'success'
							});
							this.$store.commit(ADD_USER_NAME,{userName:result.userName});
							this.$router.replace('/home');
						}
				})
			},
		}
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
	
	.backBtn {
		color: #C0CCDA;
		position: absolute;
		top: 15px;
		left: 20px;
	}
</style>
