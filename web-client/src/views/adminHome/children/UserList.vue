<template>
	<div id="">
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/adminhome' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图区 -->
		<el-card class="box-card">
			<!-- 用户搜索及添加 -->
			<el-row :gutter="20">
				<el-col :span="8">
					<el-input placeholder="请输入用户名" v-model="userName" class="input-with-select">
						<el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
					</el-input>
				</el-col>
				<el-col :span="3">
					<el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
				</el-col>
			</el-row>
			<!-- 用户列表区 -->
			<el-table :data="currentPage" border stripe>
				<el-table-column type="expand">
					<template v-slot="props">
						<el-form label-position="left" inline class="demo-table-expand">
							<el-form-item label="用户名">
								<span>{{ props.row.userName }}</span>
							</el-form-item>
							<el-form-item label="昵称">
								<span>{{ props.row.nickName || '暂无' }}</span>
							</el-form-item>
							<el-form-item label="用户邮箱">
								<span>{{ props.row.userEmail }}</span>
							</el-form-item>
							<el-form-item label="联系电话">
								<span>{{ props.row.userPhone || '暂无'}}</span>
							</el-form-item>
							<el-form-item label="地址">
								<span>{{ props.row.userAdress || '暂无'}}</span>
							</el-form-item>
							<el-form-item label="个性签名">
								<span>{{ props.row.userSign || '暂无'}}</span>
							</el-form-item>
							<el-form-item label="性别">
								<span>{{ props.row.userSex || '暂无'}}</span>
							</el-form-item>
							<el-form-item label="用户头像">
								<img :src="props.row.userAvatar" alt="" style="width:70px">
							</el-form-item>
						</el-form>
					</template>
				</el-table-column>
				<el-table-column label="#" type="index"></el-table-column>
				<el-table-column label="用户名" prop="userName"></el-table-column>
				<el-table-column label="邮箱" prop="userEmail"></el-table-column>
				<el-table-column label="联系电话" prop="userPhone"></el-table-column>
				<el-table-column label="操作" width="177px">
					<template v-slot="props">
						<!-- 编辑按钮 -->
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialogVisible(props.row.userName)">编辑</el-button>
						<!-- 删除按钮 -->
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="delUser(props.row.userName)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页区域 -->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum"
			 :page-sizes="[2, 5, 10, 15]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>
		<!-- 添加用户的对话框 -->
		<el-dialog title="添加用户" :visible.sync="addDialogVisible" @close="resetAddForm" width="50%">
			<el-form :model="addUser_form" :rules="addUser_rules" ref="addUser_form" label-width="70px">
				<!-- 用户名 -->
				<el-form-item label="用户名" prop="userName">
					<el-input v-model="addUser_form.userName" clearable></el-input>
				</el-form-item>
				<!-- 密码 -->
				<el-form-item label="密码" prop="userPsw">
					<el-input v-model="addUser_form.userPsw" type="password" show-password autocomplete="off"></el-input>
				</el-form-item>
				<!-- 邮箱 -->
				<el-form-item label="邮箱" prop="userEmail">
					<el-input v-model="addUser_form.userEmail" type="text" clearable></el-input>
				</el-form-item>
				<!-- 性别 -->
				<el-form-item label="性别" prop="userSex">
					<el-radio-group v-model="addUser_form.userSex" style="margin-left: 25px;">
						<el-radio label="男"></el-radio>
						<el-radio label="女"></el-radio>
					</el-radio-group>
				</el-form-item>
				<!-- 手机号 -->
				<el-form-item label="手机号" prop="userPhone">
					<el-input v-model="addUser_form.userPhone" type="text" clearable></el-input>
				</el-form-item>
				<!-- 地址 -->
				<el-form-item label="地址" prop="userAdress">
					<area-cascader :level="1" type="text" placeholder="请选择地区" v-model="addUser_form.userAdress" :data="pcaa" v-if="resetAdress"></area-cascader>
				</el-form-item>
				<!-- 昵称 -->
				<el-form-item label="昵称" prop="nickName">
					<el-input v-model="addUser_form.nickName" type="text" clearable></el-input>
				</el-form-item>
				<!-- 个性签名 -->
				<el-form-item label="个性签名" prop="userSign">
					<el-input v-model="addUser_form.userSign" type="text" clearable></el-input>
				</el-form-item>
				<!-- 头像上传 -->
				<el-form-item label="头像" prop="userAvatar">
					<el-upload class="avatar-uploader" action="" :show-file-list="false" :auto-upload="false" :on-change="handleAvatarAdd"
					 :before-upload="beforeAvatarUpload">
						<img v-if="addUser_form.userAvatar" :src="adduser_avatar_imgUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="addUserInfo">确 定</el-button>
				<el-button type="info" @click="resetAddForm">重 置</el-button>
				<el-button @click="addDialogVisible = false">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 编辑用户的对话框 -->
		<el-dialog title="编辑用户信息" :visible.sync="editDialogVisible" width="50%" @close="closeEdit" v-if="showEdit">
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
		getUserList,
		addUser,
		editUser,
		deleteUser
	} from 'network/admin'
	import {
		sendMail,
		userRegister,
		checkName,
		checkEmail
	} from 'network/user'
	import {
		pca,
		pcaa
	} from 'area-data'
	export default {
		name: 'UserList',
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
			let validateEmail = async (rule, value, callback) => {
				let regexp = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
				let result = await checkEmail({
					userEmail: value
				})
				if (value === '') {
					callback(new Error('请输入邮箱'));
				} else if (!regexp.test(value)) {
					callback(new Error('请输入正确格式的邮箱'));
				} else if (result.status_code === 400) {
					this.isEmail = false;
					callback(new Error('该邮箱已被注册'));
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
					callback(new Error('请输入邮箱'));
				} else if (!regexp.test(value)) {
					callback(new Error('请输入正确格式的邮箱'));
				} else if (value == this.email) {
					callback();
				} else if (result.status_code === 400) {
					this.isEmail = false;
					callback(new Error('该邮箱已被注册'));
				} else {
					callback();
				}
			};
			return {
				pcaa,
				pca,
				userName: '',
				userList: [],
				total: 0,
				//当前页面
				pagenum: 1,
				//当前每页所显示的数据条数
				pagesize: 5,
				//当前页面数据储存容器
				currentPage: [],
				//控制添加用户对话框是否显示
				addDialogVisible: false,
				//控制编辑用户对话框是否显示
				editDialogVisible: false,
				showEdit: true,
				//重置添加用户的地址选项
				resetAdress: true,
				//检查编辑用户的邮箱、头像是否改变
				email: '',
				avatar: '',
				//添加用户上传头像预览图
				adduser_avatar_imgUrl: '',
				//编辑用户上传头像预览图
				edituser_avatar_imgUrl: '',
				//添加用户的表单
				addUser_form: {
					userName: '',
					userPsw: '',
					userEmail: '',
					userSex: '',
					userAvatar: '',
					userPhone: '',
					userSign: '',
					nickName: '',
					userAdress: ''
				},
				//添加用户的规则
				addUser_rules: {
					userName: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}, {
						validator: validateName,
						trigger: 'blur'
					}],
					userPsw: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}, {
						validator: validatePsw,
						trigger: 'blur'
					}],
					userEmail: [{
						required: true,
						message: '请输入邮箱',
						trigger: 'blur'
					}, {
						validator: validateEmail,
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
					}]
				},
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
					userAdress: ''
				},
				//编辑用户的规则
				editUser_rules: {
					userName: [],
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
					}]
				}
			}
		},
		async created() {
			this.getUsers();
		},
		methods: {
			//获取用户列表
			async getUsers() {
				let {
					users,
					total
				} = await getUserList({})
				this.userList = users;
				this.total = total;
				this.setCurPage(this.pagenum);
			},
			//搜索用户
			async searchUser() {
				let {
					users,
					total
				} = await getUserList({
					userName: this.userName
				})
				this.userList = users;
				this.total = total;
				this.setCurPage(this.pagenum);
			},
			//监听pagesize改变事件
			handleSizeChange(newsize) {
				this.pagesize = newsize;
				this.setCurPage(this.pagenum);
			},
			//监听页码值改变
			handleCurrentChange(newpage) {
				this.setCurPage(newpage);
			},
			setCurPage(page) {
				this.currentPage = this.userList.slice(
					(page - 1) * this.pagesize,
					page * this.pagesize)
			},
			//添加用户头像上传
			handleAvatarAdd(file) {
				this.adduser_avatar_imgUrl = URL.createObjectURL(file.raw);
				this.addUser_form.userAvatar = file.raw;
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
			//添加用户
			async addUserInfo() {
				this.$refs.addUser_form.validate(async boolean => {
					if (!boolean) return
					let formData = new FormData();
					formData.append('userName', this.addUser_form.userName);
					formData.append('userPsw', this.addUser_form.userPsw);
					formData.append('userEmail', this.addUser_form.userEmail);
					formData.append('userSex', this.addUser_form.userSex);
					formData.append('userAdress', this.addUser_form.userAdress);
					formData.append('userPhone', this.addUser_form.userPhone);
					formData.append('userSign', this.addUser_form.userSign);
					formData.append('nickName', this.addUser_form.nickName);
					if (this.addUser_form.userAvatar) {
						formData.append('userAvatar', this.addUser_form.userAvatar);
					}
					let result = await addUser(formData)
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
					}
					this.addDialogVisible = false;
					//更新数据
					this.getUsers();
				})
			},
			//重置添加用户表单
			resetAddForm() {
				this.$refs.addUser_form.resetFields();
				this.resetAdress = false;
				this.addUser_form.userAdress = [];
				let t = setTimeout(() => {
					this.resetAdress = true
				}, 0);
			},
			//删除用户
			delUser(user) {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					let result = await deleteUser({userName:user});
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
						this.getUsers();
					}
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			//展示编辑用户的对话框
			async showEditDialogVisible(user) {
				this.editDialogVisible = true;
				let {
					users
				} = await getUserList({
					userName: user
				})
				this.editUser_form.nickName = users[0].nickName;
				this.editUser_form.userPsw = '';
				this.editUser_form.userAdress = users[0].userAdress ? users[0].userAdress.split(',') : [];
				this.editUser_form.userAvatar = users[0].userAvatar;
				this.avatar = users[0].userAvatar;
				this.editUser_form.userEmail = users[0].userEmail;
				this.email = users[0].userEmail;
				this.editUser_form.userName = users[0].userName;
				this.editUser_form.userPhone = users[0].userPhone;
				this.editUser_form.userSex = users[0].userSex;
				this.editUser_form.userSign = users[0].userSign;
			},
			//修改用户并提交
			editUserInfo() {
				this.$refs.editUser_form.validate(async boolean => {
					if (!boolean) return
					let formData = new FormData();
					formData.append('userName', this.editUser_form.userName);
					formData.append('userPsw', this.editUser_form.userPsw);
					formData.append('userEmail', this.editUser_form.userEmail);
					formData.append('userSex', this.editUser_form.userSex);
					formData.append('userAdress', this.editUser_form.userAdress);
					formData.append('userPhone', this.editUser_form.userPhone);
					formData.append('userSign', this.editUser_form.userSign);
					formData.append('nickName', this.editUser_form.nickName);
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
					if (this.userName) {
						this.searchUser();
					} else {
						this.getUsers();
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
			}
		}
	}
</script>

<style scoped>
</style>
