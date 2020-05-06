<template>
	<div id="">
		<!-- 面包屑导航 -->
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/adminhome' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图区 -->
		<el-card>
			<!-- 商品搜索及添加 -->
			<el-row :gutter="25">
				<el-col :span="15">
					<el-input placeholder="请输入商品ID或商品名称" v-model="goodsId" class="input-with-select">
						<el-select v-model="goodsCategory" slot="prepend" clearable placeholder="选择商品分类" @change="searchGoods" style="width: 180px;">
							<el-option v-for="item in cateList" :key="item.cateId" :label="item.cateName" :value="item.cateId">
							</el-option>
						</el-select>
						<el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
					</el-input>
				</el-col>
				<el-col :span="3">
					<el-button type="primary" @click="addDialogVisible = true">添加商品</el-button>
				</el-col>
			</el-row>
			<!-- 商品列表区 -->
			<el-table :data="currentPage" border stripe>
				<el-table-column type="expand">
					<template v-slot="props">
						<el-form label-position="left" inline class="demo-table-expand">
							<el-form-item label="ID">
								<span>{{ props.row.goodsId }}</span>
							</el-form-item>
							<el-form-item label="名称">
								<span>{{ props.row.shortName}}</span>
							</el-form-item>
							<el-form-item label="详细名称">
								<span>{{ props.row.goodsName }}</span>
							</el-form-item>
							<el-form-item label="原价">
								<span>{{ props.row.goodsPrice}}</span>
							</el-form-item>
							<el-form-item label="售价">
								<span>{{ props.row.normalPrice}}</span>
							</el-form-item>
							<el-form-item label="小尾巴">
								<span>{{ props.row.salesTips}}</span>
							</el-form-item>
							<el-form-item label="分类">
								<span>{{ goodsCate(props.row.goodsCategory)}}</span>
							</el-form-item>
							<el-form-item label="库存">
								<span>{{ props.row.goodsCounts}}</span>
							</el-form-item>
							<el-form-item label="评论">
								<span>共{{ props.row.goodsComments}}条</span>
							</el-form-item>
							<el-form-item label="图片">
								<img :src="props.row.goodsImg" alt="" style="height: 150px;">
							</el-form-item>
						</el-form>
					</template>
				</el-table-column>
				<el-table-column label="#" type="index"></el-table-column>
				<el-table-column label="ID" prop="goodsId"></el-table-column>
				<el-table-column label="名称" prop="shortName"></el-table-column>
				<el-table-column label="售价" prop="normalPrice"></el-table-column>
				<el-table-column label="分类" prop="goodsCategory">
					<template v-slot="props">
						{{ goodsCate(props.row.goodsCategory) }}
					</template>
				</el-table-column>
				<el-table-column label="库存" prop="goodsCounts"></el-table-column>
				<el-table-column label="操作" width="177px">
					<template v-slot="props">
						<!-- 编辑按钮 -->
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialogVisible(props.row.goodsId)">编辑</el-button>
						<!-- 删除按钮 -->
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="delGoods(props.row.goodsId,props.row.goodsCategory)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页区域 -->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum"
			 :page-sizes="[2, 5, 10, 15]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>
		<!-- 添加商品的对话框 -->
		<el-dialog title="添加用户" :visible.sync="addDialogVisible" @close="resetAddForm" width="50%">
			<el-form :model="addGoods_form" :rules="addGoods_rules" ref="addGoods_form" label-width="80px">
				<!-- 商品ID -->
				<el-form-item label="商品ID" prop="goodsId">
					<el-input v-model.number="addGoods_form.goodsId" type="text" clearable></el-input>
				</el-form-item>
				<!-- 商品名称 -->
				<el-form-item label="商品名称" prop="shortName">
					<el-input v-model="addGoods_form.shortName" type="text" clearable></el-input>
				</el-form-item>
				<!-- 详细名称 -->
				<el-form-item label="详细名称" prop="goodsName">
					<el-input v-model="addGoods_form.goodsName" type="text" clearable></el-input>
				</el-form-item>
				<!-- 原价 -->
				<el-form-item label="商品原价" prop="goodsPrice">
					<el-input v-model.number="addGoods_form.goodsPrice" type="text" clearable></el-input>
				</el-form-item>
				<!-- 售价 -->
				<el-form-item label="商品售价" prop="normalPrice">
					<el-input v-model.number="addGoods_form.normalPrice" type="text" clearable></el-input>
				</el-form-item>
				<!-- 分类 -->
				<el-form-item label="商品分类" prop="goodsCategory">
					<el-select v-model="addGoods_form.goodsCategory" clearable placeholder="选择商品分类" style="width: 100%;">
						<el-option v-for="item in cateList" :key="item.cateId" :label="item.cateName" :value="item.cateId">
						</el-option>
					</el-select>
				</el-form-item>
				<!-- 库存 -->
				<el-form-item label="商品库存" prop="goodsCounts">
					<el-input v-model.number="addGoods_form.goodsCounts" type="text" clearable></el-input>
				</el-form-item>
				<!-- 小尾巴 -->
				<el-form-item label="小尾巴" prop="salesTips">
					<el-input v-model="addGoods_form.salesTips" type="text" clearable placeholder="例:已售8万+件"></el-input>
				</el-form-item>
				<!-- 商品图片上传 -->
				<el-form-item label="商品图片" prop="goodsImg">
					<el-upload class="avatar-uploader" action="" :show-file-list="false" :auto-upload="false" :on-change="handleAvatarAdd"
					 :before-upload="beforeAvatarUpload">
						<img v-if="addGoods_form.goodsImg" :src="add_goods_imgUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="addGoodsInfo">确 定</el-button>
				<el-button type="info" @click="resetAddForm">重 置</el-button>
				<el-button @click="addDialogVisible = false">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 编辑商品的对话框 -->
		<el-dialog title="编辑用户信息" :visible.sync="editDialogVisible" width="50%" @close="closeEdit">
			<el-form :model="editGoods_form" :rules="editGoods_rules" ref="editGoods_form" label-width="80px">
				<!-- 商品ID -->
				<el-form-item label="商品ID" prop="goodsId">
					<el-input v-model.number="editGoods_form.goodsId" type="text" disabled></el-input>
				</el-form-item>
				<!-- 商品名称 -->
				<el-form-item label="商品名称" prop="shortName">
					<el-input v-model="editGoods_form.shortName" type="text" clearable></el-input>
				</el-form-item>
				<!-- 详细名称 -->
				<el-form-item label="详细名称" prop="goodsName">
					<el-input v-model="editGoods_form.goodsName" type="text" clearable></el-input>
				</el-form-item>
				<!-- 原价 -->
				<el-form-item label="商品原价" prop="goodsPrice">
					<el-input v-model.number="editGoods_form.goodsPrice" type="text" clearable></el-input>
				</el-form-item>
				<!-- 售价 -->
				<el-form-item label="商品售价" prop="normalPrice">
					<el-input v-model.number="editGoods_form.normalPrice" type="text" clearable></el-input>
				</el-form-item>
				<!-- 分类 -->
				<el-form-item label="商品分类" prop="goodsCategory">
					<el-select v-model="editGoods_form.goodsCategory" placeholder="选择商品分类" style="width: 100%;">
						<el-option v-for="item in cateList" :key="item.cateId" :label="item.cateName" :value="item.cateId">
						</el-option>
					</el-select>
				</el-form-item>
				<!-- 库存 -->
				<el-form-item label="商品库存" prop="goodsCounts">
					<el-input v-model.number="editGoods_form.goodsCounts" type="text" clearable></el-input>
				</el-form-item>
				<!-- 小尾巴 -->
				<el-form-item label="小尾巴" prop="salesTips">
					<el-input v-model="editGoods_form.salesTips" type="text" clearable placeholder="例:已售8万+件"></el-input>
				</el-form-item>
				<!-- 商品图片上传 -->
				<el-form-item label="商品图片" prop="goodsImg">
					<el-upload class="avatar-uploader" action="" :show-file-list="false" :auto-upload="false" :on-change="handleAvatarEdit"
					 :before-upload="beforeAvatarUpload">
						<img :src="edit_goods_imgUrl || editGoods_form.goodsImg" class="avatar">
					</el-upload>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editGoodsInfo">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {
		getGoodsList,
		getCateList,
		getGoodsCate,
		checkGoodsId,
		addGoods,
		editGoods,
		deleteGoods
	} from 'network/admin'
	export default {
		name: 'GoodsList',
		data() {
			var validateId = async (rule, value, callback) => {
				let result = await checkGoodsId({
					goodsId: value
				})
				if (!Number.isInteger(value)) {
					callback(new Error('请输入数字且需要为正整数'));
				} else if (result.status_code === 400) {
					callback(new Error('此ID已被使用'));
				} else {
					callback();
				}
			};
			var validateNum = async (rule, value, callback) => {
				if (!Number.isInteger(value)) {
					callback(new Error('请输入数字且需要为正整数'));
				} else {
					callback();
				}
			};
			return {
				goodsId: '',
				goodsCategory: '',
				cateList: [],
				goodsList: [],
				//数据总条数
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
				//添加商品图片预览图
				add_goods_imgUrl: '',
				//编辑商品图片预览图
				edit_goods_imgUrl: '',
				goodsImg:'',
				goodsOldCate:'',
				//添加商品的表单
				addGoods_form: {
					goodsId: '',
					shortName: '',
					goodsName: '',
					goodsPrice: '',
					normalPrice: '',
					salesTips: '',
					goodsCategory: '',
					goodsCounts: '',
					goodsImg: '',
				},
				//添加商品的规则
				addGoods_rules: {
					goodsId: [{
						required: true,
						message: '请输入商品ID',
						trigger: 'blur'
					}, {
						validator: validateId,
						trigger: 'blur'
					}],
					shortName: [{
						required: true,
						message: '请输入商品名称',
						trigger: 'blur'
					}],
					goodsName: [{
						required: true,
						message: '请输入详细名称',
						trigger: 'blur'
					}],
					goodsPrice: [{
						required: true,
						message: '请输入商品原价',
						trigger: 'blur'
					}, {
						validator: validateNum,
						trigger: 'blur'
					}],
					normalPrice: [{
						required: true,
						message: '请输入商品售价',
						trigger: 'blur'
					}, {
						validator: validateNum,
						trigger: 'blur'
					}],
					salesTips: [{
						required: true,
						message: '请输入小尾巴',
						trigger: 'blur'
					}],
					goodsCategory: [{
						required: true,
						message: '请选择商品分类',
						trigger: 'blur'
					}],
					goodsCounts: [{
						required: true,
						message: '请输入库存',
						trigger: 'blur'
					}, {
						validator: validateNum,
						trigger: 'blur'
					}],
					goodsImg: [{
						required: true,
						message: '请上传商品图片',
						trigger: 'blur'
					}],
				},
				//编辑商品的表单
				editGoods_form: {
					goodsId: '',
					shortName: '',
					goodsName: '',
					goodsPrice: '',
					normalPrice: '',
					salesTips: '',
					goodsCategory: '',
					goodsCounts: '',
					goodsImg: '',
				},
				//编辑商品的规则
				editGoods_rules: {
					goodsId: [{
						required: true,
						message: '请输入商品ID',
						trigger: 'blur'
					}],
					shortName: [{
						required: true,
						message: '请输入商品名称',
						trigger: 'blur'
					}],
					goodsName: [{
						required: true,
						message: '请输入详细名称',
						trigger: 'blur'
					}],
					goodsPrice: [{
						required: true,
						message: '请输入商品原价',
						trigger: 'blur'
					}, {
						validator: validateNum,
						trigger: 'blur'
					}],
					normalPrice: [{
						required: true,
						message: '请输入商品售价',
						trigger: 'blur'
					}, {
						validator: validateNum,
						trigger: 'blur'
					}],
					salesTips: [{
						required: true,
						message: '请输入小尾巴',
						trigger: 'blur'
					}],
					goodsCategory: [{
						required: true,
						message: '请选择商品分类',
						trigger: 'blur'
					}],
					goodsCounts: [{
						required: true,
						message: '请输入库存',
						trigger: 'blur'
					}, {
						validator: validateNum,
						trigger: 'blur'
					}],
					goodsImg: [{
						required: true,
						message: '请上传商品图片',
						trigger: 'blur'
					}],
				}
			}
		},
		created() {
			this.getGoods();
			this.getCategories();
		},
		methods: {
			//将商品id转化为具体文字
			goodsCate(cateId) {
				for (let i = 0; i < this.cateList.length; i++) {
					if (cateId == this.cateList[i].cateId) {
						return this.cateList[i].cateName;
					}
				}
			},
			//获取分类列表
			async getCategories() {
				let {
					categories,
					total
				} = await getCateList({})
				this.cateList = categories;
			},
			//获取商品列表
			async getGoods() {
				let {
					goods,
					total
				} = await getGoodsList({})
				this.goodsList = goods;
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
				this.currentPage = this.goodsList.slice(
					(page - 1) * this.pagesize,
					page * this.pagesize)
			},
			//搜索商品
			async searchGoods() {
				let {
					goods,
					total
				} = await getGoodsList({
					goodsId: this.goodsId,
					goodsCategory: this.goodsCategory
				})
				this.goodsList = goods;
				this.total = total;
				this.setCurPage(this.pagenum);
			},
			//添加商品图片上传
			handleAvatarAdd(file) {
				this.add_goods_imgUrl = URL.createObjectURL(file.raw);
				this.addGoods_form.goodsImg = file.raw;
			},
			//编辑商品图片上传
			handleAvatarEdit(file) {
				this.edit_goods_imgUrl = URL.createObjectURL(file.raw);
				this.editGoods_form.goodsImg = file.raw;
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG) {
					this.$message.error('上传商品图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传商品图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},
			//重置添加商品表单
			resetAddForm() {
				this.$refs.addGoods_form.resetFields();
			},
			//添加商品
			async addGoodsInfo() {
				this.$refs.addGoods_form.validate(async boolean => {
					if (!boolean) return
					let formData = new FormData();
					formData.append('goodsId', this.addGoods_form.goodsId);
					formData.append('shortName', this.addGoods_form.shortName);
					formData.append('goodsName', this.addGoods_form.goodsName);
					formData.append('goodsPrice', this.addGoods_form.goodsPrice);
					formData.append('normalPrice', this.addGoods_form.normalPrice);
					formData.append('salesTips', this.addGoods_form.salesTips);
					formData.append('goodsCategory', this.addGoods_form.goodsCategory);
					formData.append('goodsCounts', this.addGoods_form.goodsCounts);
					formData.append('goodsImg', this.addGoods_form.goodsImg);
					let result = await addGoods(formData)
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
					this.getGoods();
				})
			},
			//展示编辑商品的对话框
			async showEditDialogVisible(goodsId) {
				this.editDialogVisible = true;
				let {
					goods
				} = await getGoodsList({
					goodsId
				})
				this.editGoods_form.goodsId = goods[0].goodsId;
				this.editGoods_form.shortName = goods[0].shortName;
				this.editGoods_form.goodsName = goods[0].goodsName;
				this.editGoods_form.goodsPrice = Number(goods[0].goodsPrice);
				this.editGoods_form.normalPrice = Number(goods[0].normalPrice);
				this.editGoods_form.salesTips = goods[0].salesTips;
				this.editGoods_form.goodsCategory = goods[0].goodsCategory;
				this.goodsOldCate = goods[0].goodsCategory;
				this.editGoods_form.goodsCounts = Number(goods[0].goodsCounts);
				this.editGoods_form.goodsImg = goods[0].goodsImg;
				this.goodsImg = goods[0].goodsImg;
			},
			//关闭编辑对话框
			closeEdit() {
				this.$refs.editGoods_form.resetFields();
			},
			//修改用户并提交
			editGoodsInfo() {
				this.$refs.editGoods_form.validate(async boolean => {
					if (!boolean) return
					let formData = new FormData();
					formData.append('goodsId', this.editGoods_form.goodsId);
					formData.append('shortName', this.editGoods_form.shortName);
					formData.append('goodsName', this.editGoods_form.goodsName);
					formData.append('goodsPrice', this.editGoods_form.goodsPrice);
					formData.append('normalPrice', this.editGoods_form.normalPrice);
					formData.append('salesTips', this.editGoods_form.salesTips);
					formData.append('goodsCategory', this.editGoods_form.goodsCategory);
					formData.append('goodsOldCate', this.goodsOldCate);
					formData.append('goodsCounts', this.editGoods_form.goodsCounts);
					if (this.editGoods_form.goodsImg != this.goodsImg) {
						formData.append('goodsImg', this.editGoods_form.goodsImg);
					}
					let result = await editGoods(formData)
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
					if (this.goodsId) {
						this.searchGoods();
					} else {
						this.getGoods();
					}
				})
			},
			//删除商品
			delGoods(goodsId,goodsCategory) {
				this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					let result = await deleteGoods({goodsId,goodsCategory});
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
						this.getGoods();
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

<style scoped>
</style>
