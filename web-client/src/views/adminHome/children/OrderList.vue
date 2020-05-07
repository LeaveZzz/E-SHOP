<template>
	<div id="">
		<!-- 面包屑导航 -->
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/adminhome' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>订单管理</el-breadcrumb-item>
			<el-breadcrumb-item>订单列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图区 -->
		<el-card>
			<!-- 订单搜索 -->
			<el-row :gutter="25">
				<el-col :span="10">
					<el-input placeholder="请输入订单编号或用户名" v-model="userName" class="input-with-select">
						<el-button slot="append" icon="el-icon-search" @click="searchOrder"></el-button>
					</el-input>
				</el-col>
			</el-row>
			<!-- 订单列表区 -->
			<el-table :data="currentPage" border stripe>
				<el-table-column type="expand">
					<template v-slot="props">
						<el-form label-position="left" inline class="demo-table-expand">
							<el-form-item label="订单编号">
								<span>{{ props.row._id }}</span>
							</el-form-item>
							<el-form-item label="用户名">
								<span>{{ props.row.userName}}</span>
							</el-form-item>
							<el-form-item label="收件人">
								<span>{{ props.row.receiverName}}</span>
							</el-form-item>
							<el-form-item label="收货地址">
								<span>{{ props.row.receiverAdress}}</span>
							</el-form-item>
							<el-form-item label="详细地址">
								<span>{{ props.row.detailedAddress}}</span>
							</el-form-item>
							<el-form-item label="联系电话">
								<span>{{ props.row.receiverPhone}}</span>
							</el-form-item>
							<el-form-item label="商品编号">
								<span>{{ props.row.goodsId}}</span>
							</el-form-item>
							<el-form-item label="商品名称">
								<span>{{ props.row.goodsName }}</span>
							</el-form-item>
							<el-form-item label="商品尺寸">
								<span>{{ props.row.goodsSize }}</span>
							</el-form-item>
							<el-form-item label="购买数量">
								<span>{{ props.row.buyCounts}}</span>
							</el-form-item>
							<el-form-item label="总付款">
								<span>{{ props.row.totalPrice | showPrice}}元</span>
							</el-form-item>
							<el-form-item label="下单时间">
								<span>{{ props.row.orderTime | toTime}}</span>
							</el-form-item>
							<el-form-item label="备注">
								<span>{{ props.row.userNote || '无'}}</span>
							</el-form-item>
							<el-form-item label="订单状态">
								<span>{{ props.row.isSuccess | toCN}}</span>
							</el-form-item>
						</el-form>
					</template>
				</el-table-column>
				<el-table-column label="#" type="index"></el-table-column>
				<el-table-column label="订单编号" prop="_id"></el-table-column>
				<el-table-column label="用户名" prop="userName"></el-table-column>
				<el-table-column label="商品名称" prop="goodsName"></el-table-column>
				<el-table-column label="下单时间" prop="orderTime">
					<template v-slot="props">
						{{ props.row.orderTime | toTime}}
					</template>
				</el-table-column>
				<el-table-column label="购买数量" prop="buyCounts"></el-table-column>
				<el-table-column label="订单状态" prop="isSuccess">
					<template v-slot="props">
						{{ props.row.isSuccess | toCN}}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="177px">
					<template v-slot="props">
						<!-- 编辑按钮 -->
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialogVisible(props.row._id)">编辑</el-button>
						<!-- 删除按钮 -->
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="delOrder(props.row._id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页区域 -->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum"
			 :page-sizes="[2, 5, 10, 15]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>
		<!-- 编辑订单的对话框 -->
		<el-dialog title="编辑订单信息" :visible.sync="editDialogVisible" width="50%" @close="closeEdit" v-if="showEdit">
			<el-form :model="editOrder_form" :rules="editOrder_rules" ref="editOrder_form" label-width="80px">
				<!-- 订单编号 -->
				<el-form-item label="订单编号" prop="_id">
					<el-input v-model="editOrder_form._id" disabled></el-input>
				</el-form-item>
				<!-- 用户名 -->
				<el-form-item label="用户名" prop="userName">
					<el-input v-model="editOrder_form.userName" disabled></el-input>
				</el-form-item>
				<!-- 收件人 -->
				<el-form-item label="收件人" prop="receiverName">
					<el-input v-model="editOrder_form.receiverName"></el-input>
				</el-form-item>
				<!-- 收货地址 -->
				<el-form-item label="收货地址" prop="receiverAdress">
					<area-cascader :level="1" type="text" placeholder="请选择地区" v-model="editOrder_form.receiverAdress" :data="pcaa"></area-cascader>
				</el-form-item>
				<!-- 详细地址 -->
				<el-form-item label="详细地址" prop="detailedAddress">
					<el-input v-model="editOrder_form.detailedAddress" type="text" clearable></el-input>
				</el-form-item>
				<!-- 联系电话 -->
				<el-form-item label="联系电话" prop="receiverPhone">
					<el-input v-model="editOrder_form.receiverPhone" type="text" clearable></el-input>
				</el-form-item>
				<!-- 商品尺寸 -->
				<el-form-item label="商品尺寸" prop="goodsSize">
					<el-input v-model="editOrder_form.goodsSize" type="text" clearable></el-input>
				</el-form-item>
				<!-- 订单状态 -->
				<el-form-item label="订单状态" prop="isSuccess">
					<el-switch v-model="editOrder_form.isSuccess">
					</el-switch>
				</el-form-item>
				<!-- 备注 -->
				<el-form-item label="备注" prop="userNote">
					<el-input v-model="editOrder_form.userNote" type="text" clearable></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editOrderInfo">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {
		getOrderList,
		editOrder,
		deleteOrder
	} from 'network/admin'
	import {
		pca,
		pcaa
	} from 'area-data'
	export default {
		name: 'OrderList',
		data() {
			return {
				pcaa,
				pca,
				userName: '',
				orderList: [],
				//数据总条数
				total: 0,
				//当前页面
				pagenum: 1,
				//当前每页所显示的数据条数
				pagesize: 5,
				//当前页面数据储存容器
				currentPage: [],
				//控制编辑订单对话框是否显示
				editDialogVisible: false,
				showEdit: true,
				//编辑订单的表单
				editOrder_form: {
					_id: '',
					userName: '',
					receiverName: '',
					receiverAdress: [],
					detailedAddress: '',
					receiverPhone: '',
					goodsSize: '',
					isSuccess: false,
					userNote: '',
				},
				//编辑订单的规则
				editOrder_rules: {
					_id: [{
						required: true,
						message: '请填写订单编号',
						trigger: 'blur'
					}],
					userName: [{
						required: true,
						message: '请填写用户名',
						trigger: 'blur'
					}],
					receiverName: [{
						required: true,
						message: '请填写收件人',
						trigger: 'blur'
					}],
					receiverAdress: [{
						required: true,
						message: '请选择地址',
						trigger: 'blur'
					}],
					detailedAddress: [{
						required: true,
						message: '请填写详细地址',
						trigger: 'blur'
					}],
					receiverPhone: [{
						required: true,
						message: '请填写联系电话',
						trigger: 'blur'
					}],
					goodsSize: [{
						required: true,
						message: '请填写商品尺寸',
						trigger: 'blur'
					}],
					isSuccess: [{
						required: true,
						message: '请选择订单状态',
						trigger: 'blur'
					}],
					userNote: []
				}
			}
		},
		created() {
			this.getOrders();
		},
		filters: {
			toCN(value) {
				if (value) {
					return '已完成';
				} else {
					return '未完成';
				}
			},
			showPrice(value) {
				return Number(value).toFixed(2);
			},
			toTime(timestamp) {
				var date = new Date(timestamp);
				var Y = date.getFullYear() + '-';
				var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				var D = date.getDate() + ' ';
				var h = date.getHours() + ':';
				var m = date.getMinutes() + ':';
				var s = date.getSeconds();
				return Y + M + D + h + m + s;
			}
		},
		methods: {
			//获取订单列表
			async getOrders() {
				let {
					orders,
					total
				} = await getOrderList({})
				this.orderList = orders;
				this.total = total;
				this.setCurPage(this.pagenum);
			},
			//搜索商品
			async searchOrder() {
				let {
					orders,
					total
				} = await getOrderList({
					userName: this.userName,
				})
				this.orderList = orders;
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
				this.currentPage = this.orderList.slice(
					(page - 1) * this.pagesize,
					page * this.pagesize)
			},
			//关闭编辑对话框
			closeEdit() {
				this.$refs.editOrder_form.resetFields();
				this.showEdit = false;
				this.editOrder_form.receiverAdress = [];
				var t = setTimeout(() => {
					this.showEdit = true
				}, 0);
			},
			//展示编辑订单的对话框
			async showEditDialogVisible(id) {
				this.editDialogVisible = true;
				let result = await getOrderList({
					userName: id
				})
				this.editOrder_form._id = result.orders[0]._id;
				this.editOrder_form.userName = result.orders[0].userName;
				this.editOrder_form.receiverName = result.orders[0].receiverName;
				this.editOrder_form.receiverAdress = result.orders[0].receiverAdress.split(',');
				this.editOrder_form.detailedAddress = result.orders[0].detailedAddress;
				this.editOrder_form.receiverPhone = result.orders[0].receiverPhone;
				this.editOrder_form.goodsSize = result.orders[0].goodsSize;
				this.editOrder_form.isSuccess = result.orders[0].isSuccess;
				this.editOrder_form.userNote = result.orders[0].userNote;
			},
			//提交编辑订单表单
			editOrderInfo() {
				this.$refs.editOrder_form.validate(async boolean => {
					if (!boolean) return;
					this.editOrder_form.receiverAdress = this.editOrder_form.receiverAdress.join(',');
					let result = await editOrder(this.editOrder_form)
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
						this.searchOrder();
					} else {
						this.getOrders();
					}
				})
			},
			//删除订单
			delOrder(_id) {
				this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					let result = await deleteOrder({
						_id
					});
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
						this.getOrders();
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
