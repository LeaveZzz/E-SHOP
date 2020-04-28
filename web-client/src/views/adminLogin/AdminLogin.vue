<template>
	<div class="admin_login">
		<div class="login_box">
			<!-- logo盒子 -->
			<div class="logo_box">
				<img src="~assets/img/logo.svg" alt="">
			</div>
			<!-- 返回首页 -->
			<el-button type="text" icon="el-icon-arrow-left" class="backBtn" @click="goHome">返回首页</el-button>
			<!-- 表单盒子 -->
			<el-form ref="adminLogin_form" class="login_form" :model="adminLogin_form" :rules="adminLogin_formRules">
				<!-- 用户名 -->
				<el-form-item prop="adminName">
					<el-input v-model="adminLogin_form.adminName" prefix-icon="iconfont icon-user" placeholder="请输入管理员账号" type="text"
					 clearable></el-input>
				</el-form-item>
				<!-- 密码 -->
				<el-form-item prop="adminPsw">
					<el-input v-model="adminLogin_form.adminPsw" prefix-icon="iconfont icon-3702mima" placeholder="请输入密码" type="password"
					 show-password></el-input>
				</el-form-item>
				<!-- 按钮 -->
				<el-form-item class="btns">
					<el-button type="primary" @click="adminLogin">登录</el-button>
					<el-button type="info" @click="resetForm">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import {
		adminLogin
	} from 'network/admin'
	export default {
		name: 'AdminLogin',
		data() {
			return {
				//登录表单数据绑定对象
				adminLogin_form: {
					adminName: '',
					adminPsw: ''
				},
				//登录表单验证规则对象
				adminLogin_formRules: {
					adminName: [{
						required: true,
						message: '请输入管理员账号',
						trigger: 'blur'
					}, ],
					adminPsw: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}, ]
				}
			}
		},
		created(){
			
		},
		methods: {
			//重置表单
			resetForm() {
				this.$refs.adminLogin_form.resetFields();
			},
			adminLogin() {
				//登录验证
				this.$refs.adminLogin_form.validate(async boolean => {
					if (!boolean) return
					const result = await adminLogin(this.adminLogin_form)
					if (result.status_code !== 200) {
						this.$msgbox({
							showClose: true,
							message: result.message,
							type: 'error'
						});
					} else {
						this.$message({
							showClose: true,
							message: result.message,
							type: 'success'
						});
						this.$router.replace('/adminhome');
					}
				})
			},
			//返回首页
			goHome(){
				this.$router.push('/home')
			}
		}
	}
</script>

<style scoped>
	.admin_login {
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
	
	.backBtn{
		color: #C0CCDA;
		position: absolute;
		top: 15px;
		left: 20px;
	}
</style>
