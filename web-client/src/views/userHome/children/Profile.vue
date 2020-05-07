<template>
	<div class="user-detail">
		<el-card class="box-card">
			<div class="user-detail-top">基本信息<el-button type="text" @click="showEditDialogVisible">编辑</el-button>
			</div>
			<div class="user-detail-group">
				<div class="user-icon">
					<span>头像</span>
					<img :src="$store.state.userInfo.userAvatar" alt="">
				</div>
				<div class="user-item">
					<span>用户名</span>
					<span>{{ $store.state.userInfo.userName || '暂无' }}</span>
				</div>
				<div class="user-item">
					<span>昵称</span>
					<span>{{ $store.state.userInfo.nickName || '暂无' }}</span>
				</div>
				<div class="user-item">
					<span>邮箱</span>
					<span>{{ $store.state.userInfo.userEmail || '暂无' }}</span>
				</div>
				<div class="user-item">
					<span>手机</span>
					<span>{{ $store.state.userInfo.userPhone || '暂无' }}</span>
				</div>
				<div class="user-item">
					<span>性别</span>
					<span>{{ $store.state.userInfo.userSex || '暂无' }}</span>
				</div>
				<div class="user-item">
					<span>常住地</span>
					<span>{{ $store.state.userInfo.userAdress || '暂无' }}</span>
				</div>
				<div class="user-item">
					<span>个性签名</span>
					<span>{{ $store.state.userInfo.userSign || '暂无' }}</span>
				</div>
			</div>
		</el-card>
		<!-- 编辑用户的对话框 -->
		<el-dialog title="编辑用户信息" :visible.sync="editDialogVisible" width="700px" @close="closeEdit" v-if="showEdit">
			<el-form :model="editUser_form" :rules="editUser_rules" ref="editUser_form" label-width="70px">
				<!-- 用户名 -->
				<el-form-item label="用户名" prop="userName">
					<el-input v-model="editUser_form.userName" disabled></el-input>
				</el-form-item>
				<!-- 密码 -->
				<el-form-item label="密码" prop="userPsw">
					<el-input v-model="editUser_form.userPsw" type="password" show-password autocomplete="off"></el-input>
				</el-form-item>
				<!-- 邮箱 -->
				<el-form-item label="邮箱" prop="userEmail">
					<el-input v-model="editUser_form.userEmail" type="text" clearable></el-input>
				</el-form-item>
				<!-- 验证码 -->
				<el-form-item label="验证码" prop="confirmMes">			
					<el-input v-model="editUser_form.confirmMes" type="text" clearable>
						<template slot="append">
							<el-button type="text" style="margin-right: 25px;" @click="confirmMes" :disabled="isConfirmClick">{{confirmClick}}</el-button>
						</template>
					</el-input>
				</el-form-item>
				<!-- 性别 -->
				<el-form-item label="性别" prop="userSex">
					<el-radio-group v-model="editUser_form.userSex" style="margin-left: 25px;">
						<el-radio label="男"></el-radio>
						<el-radio label="女"></el-radio>
					</el-radio-group>
				</el-form-item>
				<!-- 手机号 -->
				<el-form-item label="手机号" prop="userPhone">
					<el-input v-model="editUser_form.userPhone" type="text" clearable></el-input>
				</el-form-item>
				<!-- 地址 -->
				<el-form-item label="地址">
					<area-cascader :level="1" type="text" placeholder="请选择地区" v-model="editUser_form.userAdress" :data="pcaa"></area-cascader>
				</el-form-item>
				<!-- 昵称 -->
				<el-form-item label="昵称" prop="nickName">
					<el-input v-model="editUser_form.nickName" type="text" clearable></el-input>
				</el-form-item>
				<!-- 个性签名 -->
				<el-form-item label="个性签名" prop="userSign">
					<el-input v-model="editUser_form.userSign" type="text" clearable></el-input>
				</el-form-item>
				<!-- 头像上传 -->
				<el-form-item label="头像" prop="userAvatar">
					<el-upload class="avatar-uploader" action="" :show-file-list="false" :auto-upload="false" :on-change="handleAvatarEdit"
					 :before-upload="beforeAvatarUpload">
						<img :src="edituser_avatar_imgUrl || editUser_form.userAvatar" class="avatar">
					</el-upload>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editUserInfo">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {
		ADD_USER_NAME,
		ADD_USER_INFO
	} from 'store/mutation-types'
	import {
		sendMail,
		checkEmail,
		editUser,
		isUser
	} from 'network/user'
	import {
		pca,
		pcaa
	} from 'area-data'
	export default {
		name: 'Profile',
		data() {
			let validateName = async (rule, value, callback) => {
				let regexp = /^[a-zA-Z0-9\u4e00-\u9fa5_-]{2,12}$/;
				let result = await checkName({
					userName: value
				})
				if (!regexp.test(value)) {
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
					callback();
				} else if (!regexp.test(value)) {
					callback(new Error('密码必须包含字母和数字,且在6~16位之间'));
				} else {
					callback();
				}
			};
			let validatePhone = (rule, value, callback) => {
				let regexp = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/
				if (value === '') {
					callback();
				} else if (!regexp.test(value)) {
					callback(new Error('手机号格式不正确'));
				} else {
					callback();
				}
			};
			let editValidateEmail = async (rule, value, callback) => {
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
				} else if (value == this.email) {
					callback();
				} else if (result.status_code === 400) {
					this.isEmail = false;
					callback(new Error('该邮箱已被注册'));
				} else {
					this.isEmail = true;
					callback();
				}
			};
			return {
				pcaa,
				pca,
				confirmClick: '获取验证码',
				isConfirmClick: false,
				isEmail: false,
				//控制编辑用户对话框是否显示
				editDialogVisible: false,
				showEdit: true,
				//重置添加用户的地址选项
				resetAdress: true,
				//检查编辑用户的邮箱、头像是否改变
				email: '',
				avatar: '',
				//编辑用户上传头像预览图
				edituser_avatar_imgUrl: '',
				//编辑用户的表单
				editUser_form: {
					userName: '',
					userPsw: '',
					userEmail: '',
					userSex: '',
					userAvatar: '',
					userPhone: '',
					userSign: '',
					nickName: '',
					userAdress: '',
					confirmMes:''
				},
				//编辑用户的规则
				editUser_rules: {
					userName: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
					userPsw: [{
						validator: validatePsw,
						trigger: 'blur'
					}],
					userEmail: [{
						required: true,
						message: '请输入邮箱',
						trigger: 'blur'
					}, {
						validator: editValidateEmail,
						trigger: 'blur'
					}],
					userSex: [{
						required: true,
						message: '请选择性别',
						trigger: 'blur'
					}],
					userPhone: [{
						validator: validatePhone,
						trigger: 'blur'
					}],
					confirmMes:[]
				}
			}
		},
		methods: {
			//展示编辑用户的对话框
			showEditDialogVisible() {
				this.editDialogVisible = true;
				this.editUser_form.nickName = this.$store.state.userInfo.nickName;
				this.editUser_form.userPsw = '';
				this.editUser_form.userAdress = this.$store.state.userInfo.userAdress ? this.$store.state.userInfo.userAdress.split(',') : [];
				this.editUser_form.userAvatar = this.$store.state.userInfo.userAvatar;
				this.avatar = this.$store.state.userInfo.userAvatar;
				this.editUser_form.userEmail = this.$store.state.userInfo.userEmail;
				this.email = this.$store.state.userInfo.userEmail;
				this.editUser_form.userName = this.$store.state.userInfo.userName;
				this.editUser_form.userPhone = this.$store.state.userInfo.userPhone;
				this.editUser_form.userSex = this.$store.state.userInfo.userSex;
				this.editUser_form.userSign = this.$store.state.userInfo.userSign;
			},
			//通过用户填写的邮箱发送验证码
			confirmMes() {
				if(this.editUser_form.userEmail == this.email){
					this.$msgbox({
						showClose: true,
						message: '您还未修改邮箱',
						type: 'error'
					});
					return;
				}
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
					userEmail: this.editUser_form.userEmail
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
			//编辑用户头像上传
			handleAvatarEdit(file) {
				this.edituser_avatar_imgUrl = URL.createObjectURL(file.raw);
				this.editUser_form.userAvatar = file.raw;
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;
			
				if (!isJPG) {
					this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},
			//修改信息并提交
			editUserInfo() {
				if (this.editUser_form.userEmail != this.email && this.editUser_form.confirmMes == '') {
					this.$msgbox({
						showClose: true,
						message: '请填写验证码',
						type: 'error'
					});
					return;
				}
				this.$refs.editUser_form.validate(async boolean => {
					if (!boolean) return
					let formData = new FormData();
					formData.append('userName', this.editUser_form.userName);
					formData.append('userPsw', this.editUser_form.userPsw);
					formData.append('userSex', this.editUser_form.userSex);
					formData.append('userAdress', this.editUser_form.userAdress);
					formData.append('userPhone', this.editUser_form.userPhone);
					formData.append('userSign', this.editUser_form.userSign);
					formData.append('nickName', this.editUser_form.nickName);
					formData.append('userEmail', this.editUser_form.userEmail);
					if(this.editUser_form.userEmail != this.email){
						formData.append('confirmMes', this.editUser_form.confirmMes);
					}
					if (this.editUser_form.userAvatar != this.avatar) {
						formData.append('userAvatar', this.editUser_form.userAvatar);
					}
					if (this.editUser_form.userPsw) {
						formData.append('userPsw', this.editUser_form.userPsw);
					}
					let result = await editUser(formData)
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
					}
					this.editDialogVisible = false;
					//更新数据
						let updateInfo = await isUser();
						if (updateInfo.status_code !== 400) {
							this.$store.commit(ADD_USER_NAME, {
								userName: updateInfo.userName
							});
							this.$store.commit(ADD_USER_INFO, {
								userInfo: updateInfo.userInfo,
							});
						}
				})
			},
			//关闭编辑对话框
			closeEdit() {
				this.$refs.editUser_form.resetFields();
				this.showEdit = false;
				this.edituser_avatar_imgUrl = '';
				this.editUser_form.userAdress = [];
				var t = setTimeout(() => {
					this.showEdit = true
				}, 0);
			},
		}
	}
</script>

<style scoped="scoped">
	.user-detail {
		width: 80%;
		height: 100%;
		margin: 20px auto;
	}

	.user-detail-top {
		width: 100%;
		height: 60px;
		line-height: 60px;
		padding-left: 10px;
		font-weight: bold;
	}

	.user-icon {
		height: 60px;
		padding: 0 10px;
		background-color: #fff;
		border-bottom: 1px solid #e0e0e0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	img {
		width: 50px;
		height: 50px;
		border-radius: 50%;
	}

	.user-item {
		height: 50px;
		padding: 0 10px;
		background-color: #fff;
		border-bottom: 1px solid #e0e0e0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.right-title-color {
		color: #999;
		font-size: 14px;
	}

	.el-button {
		margin-left: 30px;
	}
</style>
