<template>
	<div class="user_register">
		<div class="register_box">
			<!-- logo盒子 -->
			<div class="logo_box">
				<img src="~assets/img/boy_avatar.svg" v-if="choiceSex" alt="">
				<img src="~assets/img/girl_avatar.svg" v-else alt="">
			</div>
			<!-- 返回首页 -->
			<el-button type="text" icon="el-icon-arrow-left" class="backBtn" @click="goHome">返回首页</el-button>
			<div class="sex_toggle">
				<div><img src="~assets/img/boy_icon.svg" alt="" @click="sexToggle('男')"></div>
				<div><img src="~assets/img/girl_icon.svg" alt="" @click="sexToggle('女')"></div>
			</div>
			<!-- 表单盒子 -->
			<el-form class="register_form" ref="userRegister_form" :model="userRegister_form" :rules="userRegister_formRules">
				<!-- 用户名 -->
				<el-form-item prop="userName">
					<el-input v-model="userRegister_form.userName" prefix-icon="iconfont icon-user" placeholder="用户名" type="text"
					 clearable></el-input>
				</el-form-item>
				<!-- 密码 -->
				<el-form-item prop="userPsw">
					<el-input v-model="userRegister_form.userPsw" prefix-icon="iconfont icon-3702mima" placeholder="密码" type="password"
					 show-password autocomplete="off"></el-input>
				</el-form-item>
				<!-- 确认密码 -->
				<el-form-item prop="checkPsw">
					<el-input v-model="userRegister_form.checkPsw" prefix-icon="iconfont icon-3702mima" placeholder="确认密码" type="password"
					 show-password autocomplete="off"></el-input>
				</el-form-item>
				<!-- 邮箱 -->
				<el-form-item prop="userEmail">
					<el-input v-model="userRegister_form.userEmail" prefix-icon="el-icon-message" placeholder="邮箱" type="text"
					 clearable></el-input>
				</el-form-item>
				<!-- 验证码 -->
				<el-form-item prop="confirmMes">
					<el-input v-model="userRegister_form.confirmMes" prefix-icon="el-icon-message" placeholder="验证码" type="text"
					 clearable>
						<template slot="append">
							<el-button type="text" style="width: 110px;" @click="confirmMes" :disabled="isConfirmClick">{{confirmClick}}</el-button>
						</template>
					</el-input>
				</el-form-item>
				<!-- 按钮 -->
				<el-form-item class="btns">
					<el-button type="primary" @click="userReg">注册</el-button>
					<el-button type="info" @click="resetForm">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import {
		sendMail,
		userRegister,
		checkName,
		checkEmail
	} from 'network/user'
	export default {
		name: 'UserRegister',
		data() {
			let validateName = async (rule, value, callback) => {
				let regexp = /^[a-zA-Z0-9\u4e00-\u9fa5_-]{2,12}$/;
				let result = await checkName({
					userName: value
				})
				if (value === '') {
					callback(new Error('请输入用户名'));
				} else if (!regexp.test(value)) {
					callback(new Error('长度在2到12个字符(不能包含特殊字符)'));
				} else {
					if (result.status_code === 400) {
						callback(new Error('该用户名已被注册'));
					}
					callback();
				}
			};
			let validatePsw = (rule, value, callback) => {
				let regexp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
				if (value === '') {
					callback(new Error('请输入密码'));
				} else if (!regexp.test(value)) {
					callback(new Error('密码必须包含字母和数字,且在6~16位之间'));
				} else {
					if (this.userRegister_form.checkPsw !== '') {
						this.$refs.userRegister_form.validateField('checkPsw');
					}
					callback();
				}
			};
			let validateCheckPsw = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.userRegister_form.userPsw) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			let validateEmail = async (rule, value, callback) => {
				let regexp = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
				let result = await checkEmail({
					userEmail: value
				})
				if (value === '') {
					this.isEmail = false;
					callback(new Error('请输入邮箱'));
				} else if (!regexp.test(value)) {
					this.isEmail = false;
					callback(new Error('请输入正确格式的邮箱'));
				} else if(result.status_code === 400){
							this.isEmail = false;
							callback(new Error('该邮箱已被注册'));
				}
				else {
					this.isEmail = true;
					callback();
				}
			};
			return {
				choiceSex: true,
				confirmClick: '获取验证码',
				isEmail: false,
				isConfirmClick: false,
				//登录表单数据绑定对象
				userRegister_form: {
					checkPsw: '',
					confirmMes: '',
					userName: '',
					userPsw: '',
					userEmail: '',
					userPhone: '',
					userSex: '男',
					userAdress: '',
					userSign: '',
					userAvatar: 'http://localhost:3000/boy_avatar.svg',
					nickName:''
				},
				userRegister_formRules: {
					userName: [{
						validator: validateName,
						trigger: 'blur'
					}],
					userPsw: [{
						validator: validatePsw,
						trigger: 'blur'
					}],
					checkPsw: [{
						validator: validateCheckPsw,
						trigger: 'blur'
					}],
					userEmail: [{
						validator: validateEmail,
						trigger: 'blur'
					}],
					confirmMes: [{
						required: true,
						message: '请填写验证码',
						trigger: 'blur'
					}]
				}
			}
		},
		created() {

		},
		methods: {
			//重置表单
			resetForm() {
				this.$refs.userRegister_form.resetFields();
			},
			//返回首页
			goHome() {
				this.$router.push('/home')
			},
			//切换头像&性别
			sexToggle(sex) {
				if (sex === '男') {
					this.choiceSex = true;
					this.userRegister_form.userAvatar =
						'http://localhost:3000/boy_avatar.svg';
					this.userRegister_form.userSex = '男'
				} else {
					this.choiceSex = false;
					this.userRegister_form.userAvatar =
						'http://localhost:3000/girl_avatar.svg';
					this.userRegister_form.userSex = '女'
				}
			},
			//通过用户填写的邮箱发送验证码
			confirmMes() {
				if (!this.isEmail) {
					this.$msgbox({
						showClose: true,
						message: '请先填写正确邮箱',
						type: 'error'
					});
					return;
				}
				//发送验证码
				sendMail({
					userEmail: this.userRegister_form.userEmail
				}).then(result => {
					this.$message({
						showClose: true,
						message: result.message,
						type: 'success'
					});
				})
				//禁止按钮
				this.isConfirmClick = true;
				let s = 10;
				this.confirmClick = `${s}秒后重新发送`;
				s--;
				//设置倒计时
				let time = setInterval(() => {
					this.confirmClick = `${s}秒后重新发送`;
					s--;
					if (s < 0) {
						clearInterval(time)
						this.isConfirmClick = false;
						this.confirmClick = '发送验证码'
					}
				}, 1000);
			},
			//用户注册
			async userReg() {
				this.$refs.userRegister_form.validate(async boolean => {
					if (!boolean) return
					let result = await userRegister(this.userRegister_form)
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
							this.$router.replace('/userlogin');
						}
				})
			},
		}
	}
</script>

<style scoped>
	.user_register {
		background-color: #2b4b6b;
		height: 100%;
	}

	.register_box {
		width: 450px;
		height: 500px;
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

	.sex_toggle {
		position: absolute;
		top: 70px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		justify-content: center;
	}

	.sex_toggle img {
		width: 30px;
		margin-left: 20px;
		margin-right: 20px;
	}

	.register_form {
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
