<template>
	<div id="">
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/adminhome' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>管理员列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图区 -->
		<el-card class="box-card">
			<!-- 管理员搜索及添加 -->
			<el-row :gutter="20">
				<el-col :span="8">
					<el-input v-model="adminName" placeholder="请输入管理员名" class="input-with-select">
						<el-button slot="append" icon="el-icon-search" @click="searchAdmin"></el-button>
					</el-input>
				</el-col>
				<el-col :span="3">
					<el-button type="primary" @click="openAddDialog">添加管理员</el-button>
				</el-col>
			</el-row>
			<!-- 管理员列表区 -->
			<el-table :data="currentPage" border>
				<el-table-column label="#" type="index"></el-table-column>
				<el-table-column label="管理员名称" prop="adminName"></el-table-column>
				<el-table-column label="角色" prop="role"></el-table-column>
				<el-table-column label="操作" width="177px">
					<template v-slot="props">
						<!-- 编辑按钮 -->
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialogVisible(props.row.adminName)">编辑</el-button>
						<!-- 删除按钮 -->
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="delAdmin(props.row.adminName)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页区域 -->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum"
			 :page-sizes="[2, 5, 10, 15]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>
		</el-card>
		<!-- 添加管理员的对话框 -->
		<el-dialog title="添加管理员" :visible.sync="addDialogVisible" @close="resetAddForm" width="50%">
			<el-form :model="addAdmin_form" :rules="addAdmin_rules" ref="addAdmin_form" label-width="70px">
				<!-- 用户名 -->
				<el-form-item label="用户名" prop="adminName">
					<el-input v-model="addAdmin_form.adminName" clearable></el-input>
				</el-form-item>
				<!-- 密码 -->
				<el-form-item label="密码" prop="adminPsw">
					<el-input v-model="addAdmin_form.adminPsw" type="password" show-password autocomplete="off"></el-input>
				</el-form-item>
				<!-- 角色 -->
				<el-form-item label="角色" prop="adminRole">
					<el-radio-group v-model="addAdmin_form.adminRole" style="margin-left: 25px;">
						<el-radio label="超级管理员"></el-radio>
						<el-radio label="普通管理员"></el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="addAdminInfo">确 定</el-button>
				<el-button type="info" @click="resetAddForm">重 置</el-button>
				<el-button @click="addDialogVisible = false">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 编辑管理员的对话框 -->
		<el-dialog title="编辑管理员信息" :visible.sync="editDialogVisible" width="50%" @close="closeEdit">
			<el-form :model="editAdmin_form" :rules="editAdmin_rules" ref="editAdmin_form" label-width="70px">
				<!-- 用户名 -->
				<el-form-item label="管理员" prop="adminName">
					<el-input v-model="editAdmin_form.adminName" disabled></el-input>
				</el-form-item>
				<!-- 密码 -->
				<el-form-item label="密码" prop="adminPsw">
					<el-input v-model="editAdmin_form.adminPsw" type="password" show-password autocomplete="off"></el-input>
				</el-form-item>
				<!-- 角色 -->
				<el-form-item label="角色" prop="adminRole">
					<el-radio-group v-model="editAdmin_form.adminRole" style="margin-left: 25px;">
						<el-radio label="超级管理员"></el-radio>
						<el-radio label="普通管理员"></el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editAdminInfo">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {
		getAdminList,
		addAdmin,
		checkName,
		editAdmin,
		deleteAdmin
	} from 'network/admin'
	export default {
		name: 'AdminList',
		data() {
			let validateName = async (rule, value, callback) => {
				let result = await checkName({
					adminName: value
				})
				if (result.status_code === 400) {
					callback(new Error('该名称已被注册'));
				} else {
					callback();
				}
			}
			return {
				adminName: '',
				adminList: [],
				//控制添加表单是否显示
				addDialogVisible: false,
				//控制编辑表单是否显示
				editDialogVisible:false,
				//数据总条数
				total: 0,
				//当前页面
				pagenum: 1,
				//当前每页所显示的数据条数
				pagesize: 5,
				//当前页面数据储存容器
				currentPage: [],
				//添加管理员表单
				addAdmin_form: {
					adminName: '',
					adminPsw: '',
					adminRole: ''
				},
				//添加管理员表单规则
				addAdmin_rules: {
					adminName: [{
						required: true,
						message: '请输入管理员名称',
						trigger: 'blur'
					},{
						validator: validateName,
						trigger: 'blur'
					}],
					adminPsw: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}],
					adminRole: [{
						required: true,
						message: '请选择管理员权限',
						trigger: 'blur'
					}]
				},
				//编辑管理员表单
				editAdmin_form:{
					adminName: '',
					adminPsw: '',
					adminRole: ''
				},
				//编辑管理员表单规则
				editAdmin_rules:{
					adminName: [{
						required: true,
						message: '请输入管理员名称',
						trigger: 'blur'
					}],
					adminPsw: [],
					adminRole: [{
						required: true,
						message: '请选择管理员权限',
						trigger: 'blur'
					}]
				},
			}
		},
		created() {
			this.getAdministrators();
		},
		methods: {
			//获取管理员列表
			async getAdministrators() {
				let {
					administrators,
					total
				} = await getAdminList({})
				this.adminList = administrators;
				this.total = total;
				this.setCurPage(this.pagenum);
			},
			//搜索管理员
			async searchAdmin() {
				let {
					administrators,
					total
				} = await getAdminList({
					adminName: this.adminName
				})
				this.adminList = administrators;
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
				this.currentPage = this.adminList.slice(
					(page - 1) * this.pagesize,
					page * this.pagesize)
			},
			//打开添加管理员表单
			async openAddDialog() {
				let {
					administrators,
				} = await getAdminList({
					adminName: this.$store.state.adminName
				});
				if (administrators[0].role == '普通管理员') {
					this.$msgbox({
						showClose: true,
						message: '普通管理员没有该权限',
						type: 'error'
					});
					return;
				}
				this.addDialogVisible = true;
			},
			//添加管理员
			addAdminInfo() {
				this.$refs.addAdmin_form.validate(async boolean => {
					if (!boolean) return
					let result = await addAdmin(this.addAdmin_form)
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
						this.addDialogVisible = false;
						this.getAdministrators();
					}
				})
			},
			//重置添加管理员表单
			resetAddForm() {
				this.$refs.addAdmin_form.resetFields();
			},
			//展示编辑管理员的对话框
			async showEditDialogVisible(admin) {
				this.editDialogVisible = true;
				let result = await getAdminList({adminName: admin})
				this.editAdmin_form.adminPsw = '';
				this.editAdmin_form.adminName = result.administrators[0].adminName;
				this.editAdmin_form.adminRole = result.administrators[0].role;
			},
			//提交编辑管理员表单
			editAdminInfo(){
				this.$refs.editAdmin_form.validate(async boolean => {
					if (!boolean) return
					let {
						administrators,
					} = await getAdminList({
						adminName: this.$store.state.adminName
					});
					if (administrators[0].role == '普通管理员') {
						if (administrators[0].adminName != this.editAdmin_form.adminName) {
							this.$msgbox({
								showClose: true,
								message: '普通管理员不能修改其他管理员信息',
								type: 'error'
							});
							return;
						}else if(administrators[0].adminName == this.editAdmin_form.adminName && this.editAdmin_form.adminRole == '超级管理员'){
							this.$msgbox({
								showClose: true,
								message: '普通管理员没有该权限',
								type: 'error'
							});
							return;
						}
					}else{
						if(administrators[0].adminName == this.editAdmin_form.adminName && this.editAdmin_form.adminRole == '普通管理员'){
							this.$msgbox({
								showClose: true,
								message: '不能降低自己的权限',
								type: 'error'
							});
							return;
						}
					}
					let result = await editAdmin(this.editAdmin_form)
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
					if (this.adminName) {
						this.searchAdmin();
					} else {
						this.getAdministrators();
					}
				})
			},
			//关闭编辑管理员表单
			closeEdit(){
				this.$refs.editAdmin_form.resetFields();
			},
			//删除管理员
			async delAdmin(admin) {
					let {
						administrators,
					} = await getAdminList({
						adminName: this.$store.state.adminName
					});
					if (administrators[0].role == '普通管理员') {
						this.$msgbox({
							showClose: true,
							message: '普通管理员没有该权限',
							type: 'error'
						});
						return;
					}else{
						if(administrators[0].adminName == admin){
							this.$msgbox({
								showClose: true,
								message: '不能删除自己',
								type: 'error'
							});
							return;
						}
					}
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					let result = await deleteAdmin({adminName:admin});
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
						this.getAdministrators();
					}
				}).catch((err) => {
					console.log(err)
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
		}
	}
</script>

<style scoped>
</style>
