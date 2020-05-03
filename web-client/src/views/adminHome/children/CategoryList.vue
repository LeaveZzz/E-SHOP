<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/adminhome' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>分类列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图区 -->
		<el-card>
			<el-row>
				<el-col>
					<el-button type="primary" @click="addDialogVisible = true">添加分类</el-button>
				</el-col>
			</el-row>
			<!-- 分类列表 -->
			<el-table :data="currentPage" border>
				<el-table-column label="#" type="index"></el-table-column>
				<el-table-column label="ID" prop="cateId"></el-table-column>
				<el-table-column label="名称" prop="cateName"></el-table-column>
				<el-table-column label="商品数量" prop="cateCounts"></el-table-column>
				<el-table-column label="操作" width="177px">
					<template v-slot="props">
						<!-- 编辑按钮 -->
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialogVisible(props.row.cateId)">编辑</el-button>
						<!-- 删除按钮 -->
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="delAdmin(props.row.cateId)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页区域 -->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum"
			 :page-sizes="[2, 5, 10, 15]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>
		<!-- 添加分类的对话框 -->
		<el-dialog title="添加分类" :visible.sync="addDialogVisible" @close="resetAddForm" width="50%">
			<el-form :model="addCate_form" :rules="addCate_rules" ref="addCate_form" label-width="80px">
				<!-- 分类Id -->
				<el-form-item label="分类ID" prop="cateId">
					<el-input v-model.number="addCate_form.cateId" clearable></el-input>
				</el-form-item>
				<!-- 分类名称 -->
				<el-form-item label="分类名称" prop="cateName">
					<el-input v-model="addCate_form.cateName" clearable></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="addCateInfo">确 定</el-button>
				<el-button type="info" @click="resetAddForm">重 置</el-button>
				<el-button @click="addDialogVisible = false">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 编辑分类的对话框 -->
		<el-dialog title="编辑分类信息" :visible.sync="editDialogVisible" width="50%" @close="closeEdit">
			<el-form :model="editCate_form" :rules="editCate_rules" ref="editCate_form" label-width="80px">
				<!-- 分类Id -->
				<el-form-item label="分类ID" prop="cateId">
					<el-input v-model.number="editCate_form.cateId" disabled></el-input>
				</el-form-item>
				<!-- 分类名称 -->
				<el-form-item label="分类名称" prop="cateName">
					<el-input v-model="editCate_form.cateName" clearable></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editCateInfo">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {
		getCateList,
		checkCateId,
		checkCateName,
		addCate,
		editCate,
		deleteCate
	} from 'network/admin'
	export default {
		name: 'CategoryList',
		data() {
			var validateId = async (rule, value, callback) => {
				let result = await checkCateId({
					cateId: value
				})
				if (!Number.isInteger(value)) {
					callback(new Error('请输入数字且需要为正整数'));
				} else if (result.status_code === 400) {
					callback(new Error('此ID已被使用'));
				} else {
					callback();
				}
			};
			var validateName = async (rule, value, callback) => {
				let result = await checkCateName({
					cateName: value
				})
				if (result.status_code === 400) {
					callback(new Error('此分类名称已被使用'));
				} else {
					callback();
				}
			};
			return {
				cateList: [],
				//数据总条数
				total: 0,
				//当前页面
				pagenum: 1,
				//当前每页所显示的数据条数
				pagesize: 5,
				//当前页面数据储存容器
				currentPage: [],
				//控制添加表单是否显示
				addDialogVisible: false,
				//控制编辑表单是否显示
				editDialogVisible:false,
				//添加分类表单
				addCate_form: {
					cateId: '',
					cateName: '',
				},
				//添加分类表单规则
				addCate_rules: {
					cateId: [{
						required: true,
						message: '请设置分类ID',
						trigger: 'blur'
					}, {
						validator: validateId,
						trigger: 'blur'
					}],
					cateName: [{
						required: true,
						message: '请输入分类名称',
						trigger: 'blur'
					},{
						validator: validateName,
						trigger: 'blur'
					}],
				},
				//编辑分类表单
				editCate_form:{
					cateId: '',
					cateName: '',
				},
				//编辑分类表单规则
				editCate_rules:{
					cateId: [{
						required: true,
						message: '请设置分类ID',
						trigger: 'blur'
					}],
					cateName: [{
						required: true,
						message: '请输入分类名称',
						trigger: 'blur'
					},{
						validator: validateName,
						trigger: 'blur'
					}],
				},
			}
		},
		created() {
			this.getCategories();
		},
		methods: {
			//获取分类列表
			async getCategories() {
				let {
					categories,
					total
				} = await getCateList({})
				this.cateList = categories;
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
				this.currentPage = this.cateList.slice(
					(page - 1) * this.pagesize,
					page * this.pagesize)
			},
			//重置添加分类表单
			resetAddForm() {
				this.$refs.addCate_form.resetFields();
			},
			//添加分类
			addCateInfo() {
				this.$refs.addCate_form.validate(async boolean => {
					if (!boolean) return
					let result = await addCate(this.addCate_form)
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
						this.getCategories();
					}
				})
			},
			//关闭编辑分类表单时重置
			closeEdit(){
				this.$refs.editCate_form.resetFields();
			},
			//展示编辑管理员的对话框
			async showEditDialogVisible(id) {
				this.editDialogVisible = true;
				let result = await getCateList({cateId: id})
				this.editCate_form.cateId = result.categories[0].cateId;
				this.editCate_form.cateName = result.categories[0].cateName;
			},
			//提交编辑分类表单
			editCateInfo(){
				this.$refs.editCate_form.validate(async boolean => {
					if (!boolean) return
					let result = await editCate(this.editCate_form)
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
					this.getCategories();
				})
			},
			//删除分类
			delAdmin(id) {
				this.$confirm('此操作将永久删除该分类以及该分类下所有商品, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					let result = await deleteCate({cateId:id});
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
						//更新数据
						this.getCategories();
					}
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
		}
	}
</script>

<style scoped="scoped">
</style>
