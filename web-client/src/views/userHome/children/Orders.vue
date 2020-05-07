<template>
	<div>
		<!-- 订单列表区 -->
		<el-card>
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
				<el-table-column label="操作" width="95px">
					<template v-slot="props">
						<!-- 收货按钮 -->
						<el-button v-if="!props.row.isSuccess" type="primary" icon="el-icon-shopping-cart-2" size="mini" @click="receive(props.row._id)">收货</el-button>
						<!-- 评价按钮 -->
						<el-button v-else type="success" icon="el-icon-edit" size="mini" @click="goDetail(props.row.goodsId)">评价</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页区域 -->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum"
			 :page-sizes="[2, 5, 10, 15]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>
	</div>
</template>

<script>
	import {
		getOrderList,
		receiveGoods
	} from 'network/user'
	export default{
		name:'Orders',
		data() {
			return {
				orderList: [],
				//数据总条数
				total: 0,
				//当前页面
				pagenum: 1,
				//当前每页所显示的数据条数
				pagesize: 5,
				//当前页面数据储存容器
				currentPage: [],
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
		methods:{
			//获取订单列表
			async getOrders() {
				let {
					orders,
					total
				} = await getOrderList({
					userName:this.$store.state.userInfo.userName
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
			//去往详情页面
			goDetail(id){
			  this.$router.push({path:'/goodsdetail',query:{goodsId:id}});
			},
			//收货
			receive(_id){
				this.$confirm('确认收货后订单状态会更新为已完成且不可修改, 是否确认收货?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					let result = await receiveGoods({_id});
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
						message: '已取消收货'
					});
				});
			}
		}
	}
</script>

<style scoped="scoped">
</style>
