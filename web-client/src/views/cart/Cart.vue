<template>
	<div id="shopcar">
		<div id="content">
			<div class="header">
				<!-- <img src="~assets/img/Leo.jpg" class="header_logo" /> -->
				<span>购物车</span>
			</div>
			<div class="cont_title">
				<span>全部商品</span>
			</div>
			<div class="cont_op">
				<div class="con_selet">
					<input type="checkbox" class="con_selectAll" :checked="isSelectedAll" @click="selectedAll(isSelectedAll)" />
					<label for="con_selectAll">全选</label>
				</div>
				<div>商品信息</div>
				<div>单价</div>
				<div>尺码</div>
				<div>数量</div>
				<div>金额</div>
				<div>操作</div>
			</div>
			<div class="pro_box" v-if="cartList.length">
				<div class="goods" v-for="(goods, index) in cartList" :key="index">
					<ul class="item_content">
						<li class="td td-chk">
							<div>
								<input type="checkbox" class="checkBox" :checked="goods.checked" @click="singleSelected(index)" />
							</div>
						</li>
						<li class="td td-item">
							<div class="td-item-pic">
								<img :src="goods.goodsImg" @click="goDetail(goods.goodsId)"/>
							</div>
							<div class="td-item-info" @click="goDetail(goods.goodsId)">{{goods.shortName}}</div>
						</li>
						<li class="td td-price"><strong>{{goods.normalPrice | showPrice}}</strong></li>
						<li class="td td-size"><strong>{{goods.goodsSize}}</strong></li>
						<li class="td td-amount">
							<div class="item-amout">
								<el-input-number style="width: 150px;" v-model="goods.buyCounts" :min="1" :max="Number(goods.goodsCounts)"
								 @change="updateGoodsCount(goods, goods.buyCounts)"></el-input-number>
							</div>
						</li>
						<li class="td td-sum"><strong>{{goods.buyCounts * goods.normalPrice | showPrice}}</strong></li>
						<li class="td td-op">
							<el-button type="danger" size="mini" plain @click="clickTrash(goods)">删除</el-button>
						</li>
					</ul>
				</div>
			</div>
			<div class="pro_empty" v-else>
				<h2>购物车里空空如也</h2>
			</div>
		</div>
		<div id="footer">
			<div class="foot_select">
				<input type="checkbox" class="foot_selectAll" name="foot_selectAll" :checked="isSelectedAll" @click.stop="selectedAll(isSelectedAll)" />
				<label for="foot_selectAll">全选</label>
			</div>
			<div class="foot_op">
				<a class="foot_remove" @click.prevent="emptyCart">清空购物车</a>
			</div>
			<div class="foot_total">
				<div class="amout-sum">
					<span class="txt">已选商品</span>
					<strong id="selected_amout">{{totalAmount}}</strong>
					<span class="txt">件</span>
				</div>
				<div class="price-sum">
					<span class="txt">合计（不含运费）：</span>
					<strong class="selected_price">{{totalPrice | showPrice}}元</strong>
				</div>
				<div class="btn-area">
					<a class="btn-sumbit" :class="{'btn-allow': totalAmount}" @click="checkOrder">结&nbsp;算</a>
				</div>
			</div>
		</div>
		<!-- 确认订单对话框 -->
		<el-dialog title="确认收件人信息" :visible.sync="dialogFormVisible" width="50%">
			<el-form :model="orderForm" :rules="orderFormRules" ref="orderForm" label-width="80px">
				<el-form-item label="收件人" prop="receiverName">
					<el-input v-model="orderForm.receiverName" clearable></el-input>
				</el-form-item>
				<el-form-item label="收件地址" prop="receiverAdress">
					<area-cascader :level="1" type="text" placeholder="请选择地区" v-model="orderForm.receiverAdress" :data="pcaa"></area-cascader>
				</el-form-item>
				<el-form-item label="详细地址" prop="detailedAddress">
					<el-input v-model="orderForm.detailedAddress" placeholder="例如:XX街道XX小区1单元101室" clearable></el-input>
				</el-form-item>
				<el-form-item label="联系电话" prop="receiverPhone">
					<el-input v-model="orderForm.receiverPhone" clearable></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="userNote">
					<el-input v-model="orderForm.userNote" clearable></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="toCreateOrder">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {
		ADD_USER_NAME,
		ADD_USER_INFO
	} from 'store/mutation-types'
	import {
		isUser,
		getCartList,
		updateCart,
		deleteCateGoods,
		createOrder
	} from 'network/user'
	import {
		pca,
		pcaa
	} from 'area-data'
	export default {
		data() {
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
			return {
				pcaa,
				pca,
				cartList: [],
				shopsNum: [],
				isSelectedAll: false,
				// 商品总价
				totalPrice: 0,
				totalAmount: 0,
				dialogFormVisible: false,
				//确认收件人信息
				orderForm: {
					receiverName: '',
					receiverAdress: [],
					receiverPhone: '',
					detailedAddress: '',
					userNote: ''
				},
				//确认收件人信息规则
				orderFormRules: {
					receiverName: [{
						required: true,
						message: '请填写收件人',
						trigger: 'blur'
					}],
					receiverAdress: [{
						required: true,
						message: '请填写地址',
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
					}, {
						validator: validatePhone,
						trigger: 'blur'
					}],
					userNote: []
				},
			}
		},
		filters: {
			showPrice(price) {
				return Number(price).toFixed(2);
			}
		},
		async created() {
			//判断用户是否为登录状态
			let result = await isUser();
			if (result.status_code !== 400) {
				this.$store.commit(ADD_USER_NAME, {
					userName: result.userName
				});
				this.$store.commit(ADD_USER_INFO, {
					userInfo: result.userInfo,
				});
			} else {
				this.$msgbox({
					type: 'info',
					message: "请先登录!",
					showClose: true,
				});
				this.$router.replace('/userlogin');
				return;
			}
			this.getCarts();
		},
		mounted() {
			this.$bus.$on('userLayout', () => {
				this.$router.replace('/home')
			})
		},
		methods: {
			//前往详情页
			goDetail(id){
			  this.$router.push({path:'/goodsdetail',query:{goodsId:id}});
			},
			//获取购物车列表
			async getCarts() {
				let result = await getCartList({
					userName: this.$store.state.userInfo.userName
				})
				this.cartList = result.carts;
				for (let i = 0; i < this.cartList.length; i++) {
					this.cartList[i].checked = false;
				}
			},
			//更新单个商品数量
			async updateGoodsCount(goods, count) {
				await updateCart({
					userName: this.$store.state.userInfo.userName,
					goodsId: goods.goodsId,
					buyCounts: count
				})
				this.getCarts();
				this.getAllGoodsPrice();
			},
			//是否选中所有商品
			selectedAll(isSelectedAll) {
				this.isSelectedAll = !isSelectedAll;
				if (this.isSelectedAll) {
					this.cartList.forEach((goods, index) => {
						goods.checked = true;
					});
				} else {
					this.cartList.forEach((goods, index) => {
						goods.checked = false;
					});
				}
				this.hasSelectedAll();
				this.getAllGoodsPrice();
			},
			//计算商品总价
			getAllGoodsPrice() {
				let totalPrice = 0;
				this.cartList.forEach((goods, index) => {
					if (goods.checked) {
						totalPrice += goods.normalPrice * goods.buyCounts;
					}
				});
				this.totalPrice = totalPrice;
			},
			//单个商品的选中与否
			singleSelected(index) {
				this.cartList[index].checked = !this.cartList[index].checked;
				this.hasSelectedAll();
				this.getAllGoodsPrice();
			},
			//判断是否全选
			hasSelectedAll() {
				let flag = true;
				let totalNum = 0
				this.cartList.forEach((goods, index) => {
					if (goods.checked) {
						totalNum += 1;
					} else {
						flag = false;
					}
				});
				this.totalAmount = totalNum;
				this.isSelectedAll = flag;
			},
			//删除单个商品
			clickTrash(goods) {
				this.$confirm('您确定删除该商品吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					let result = await deleteCateGoods({
						userName: goods.userName,
						goodsId: goods.goodsId,
						goodsSize: goods.goodsSize
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
						this.getCarts();
						this.getAllGoodsPrice();
					}
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			//删除所有商品
			emptyCart() {
				this.$confirm('您确定删除所有商品吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					let result = await deleteCateGoods({
						userName: this.$store.state.userInfo.userName
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
						this.getCarts();
						this.getAllGoodsPrice();
					}
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			//确认收件人信息
			checkOrder() {
				this.dialogFormVisible = true;
				this.orderForm.receiverName = this.$store.state.userInfo.userName;
				this.orderForm.receiverAdress = this.$store.state.userInfo.userAdress ? this.$store.state.userInfo.userAdress.split(
					',') : [];
				this.orderForm.receiverPhone = this.$store.state.userInfo.userPhone;
			},
			//创建订单
			toCreateOrder() {
				this.$refs.orderForm.validate(boolean => {
					if (!boolean) return
					this.$confirm('您确定付款并创建订单吗？订单创建后信息不可修改！', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let flag = true;
						let message = '';
						this.cartList.forEach(async (goods, index) => {
							if (goods.checked) {
								let createOrderInfo = {
									goodsId: goods.goodsId,
									goodsName: goods.goodsName,
									userName: this.$store.state.userInfo.userName,
									receiverAdress: this.orderForm.receiverAdress,
									detailedAddress: this.orderForm.detailedAddress,
									receiverPhone: this.orderForm.receiverPhone,
									goodsSize: goods.goodsSize,
									buyCounts: goods.buyCounts,
									totalPrice: this.totalPrice,
									userNote: this.orderForm.userNote,
									goodsCategory: goods.goodsCategory,
									receiverName: this.orderForm.receiverName,
								}
								console.log(createOrderInfo)
								let result = await createOrder(createOrderInfo);
								if (result.status_code !== 200) {
									flag = false;
									message = result.message
								}
							}
						});
						if (!flag) {
							this.$msgbox({
								showClose: true,
								message,
								type: 'error'
							});
						} else {
							this.$message({
								showClose: true,
								message: '创建订单成功',
								type: 'success'
							});
							this.dialogFormVisible = false;
							this.getCarts();
							this.getAllGoodsPrice();
						}
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消'
						});
					});
				})
			}
		},
	}
</script>

<style scoped>
	#content>.header {
		width: 100%;
		height: 90px;
		margin-top: 10px;
		position: relative;
	}

	.header>img {
		width: 80px;
		height: 80px;
		border: 1px solid gray;
		border-radius: 50%;
		cursor: pointer;
	}

	.header>span {
		display: inline-block;
		font-size: 25px;
		height: 35px;
		font-weight: 700;
		position: absolute;
		top: 30%;
		margin-left: 20px;
		cursor: pointer;
	}

	#content>.cont_title {
		margin: 10px auto;
		width: 80%;
		height: 35px;
		border-bottom: 2px solid #e6e6e6;
	}

	.cont_title>span {
		position: relative;
		top: 2px;
		display: inline-block;
		font-weight: 700;
		font-size: 17px;
		height: 100%;
		width: 100px;
		text-align: center;
		line-height: 25px;
		cursor: pointer;
		color: #f40;
		border-bottom: 2px solid #f40;
	}

	#content>.cont_op {
		width: 80%;
		margin: 0 auto;
		height: 40px;
		display: flex;
		justify-content: space-around;
	}

	.cont_op>div {
		line-height: 40px;
	}

	.cont_op>div:nth-child(2) {
		width: 120px;
	}

	#content>.pro_box {
		margin: 0 auto;
		text-align: center;
		width: 80%;
	}

	#content>.pro_empty {
		margin: 100px auto;
		text-align: center;
		width: 80%;
	}

	.pro_box>.goods {
		background: #fcfcfc;
		width: 100%;
		height: 130px;
		border: 1px solid #CCCCCC;
	}

	.goods>.item_content {
		padding: 15px;
		line-height: 83px;
		list-style: none;

		display: flex;
		justify-content: space-around;
	}

	.item_content>.td-item {
		width: 180px;
		position: relative;
		left: -15px;
		top: 10px;
	}

	.td-item>div {
		display: inline-block;
	}

	.td-item>.td-item-pic>img {
		width: 80px;
		height: 80px;
	}

	.td-item>.td-item-info {
		position: absolute;
		width: 80px;
		line-height: 15px;
		font-size: 12px;
		top: 0;
		margin-left: 10px;
	}

	.item_content>.td-sum {
		color: #f40;
		position: relative;
		left: 5px;
	}

	.td-price {
		position: relative;
		left: 25px;
	}

	.td-size {
		position: relative;
		left: 55px;
	}

	.td-amount>.item-amout {
		height: 25px;
		position: relative;
		left: 40px;
	}

	.item-amout a {
		display: inline-block;
		height: 23px;
		width: 17px;
		border: 1px solid #e5e5e5;
		background: #f0f0f0;
		text-align: center;
		line-height: 23px;
		color: #444;
		cursor: pointer;
	}

	.item-amout a:hover {
		color: #f50;
		border-color: #f60;
	}

	.item-amout>.text_amount {
		width: 40px;
		height: 20px;
		text-align: center;
		display: inline-block;
	}

	.td-op {
		position: relative;
		left: 13px;
	}

	#footer {
		width: 80%;
		height: 50px;
		position: fixed;
		bottom: 0;
		left: 10%;
		background: #E5E5E5;
		z-index: 9999;
	}

	#footer div {
		display: inline-block;
	}

	#footer>.foot_select {
		width: 50px;
		height: 50px;
		line-height: 50px;
		padding-left: 5px;
		cursor: pointer;
		font-size: 14px;
	}

	.foot_select input,
	.foot_select label {
		cursor: pointer;
	}

	.foot_op {
		line-height: 50px;
		height: 50px;
	}

	.foot_op>.foot_remove {
		margin-left: 25px;
		font-size: 14px;
		cursor: pointer;
	}

	.foot_remove:hover {
		color: #f40;
	}

	.foot_total {
		float: right;
	}

	.foot_total>.amout-sum {
		cursor: pointer;
		height: 50px;
		color: #3c3c3c;
	}

	.foot_total .txt {
		line-height: 50px;
		font-size: 14px;
	}

	.amout-sum>#selected_amout {
		padding: 0 5px;
		color: #f40;
		font-weight: 700;
		font-size: 18px;
	}

	.price-sum {
		margin-left: 50px;
	}

	.price-sum>.selected_price {
		color: #f40;
		font-weight: 700;
		font-size: 20px;
		line-height: 50px;
	}

	.btn-area>.btn-sumbit {
		display: inline-block;
		background: #B0B0B0;
		color: #fff;
		border-left: 1px solid #e7e7e7;
		width: 119px;
		height: 50px;
		cursor: not-allowed;
		text-align: center;
		line-height: 50px;
		font-size: 20px;
	}

	.btn-area>.btn-sumbit.btn-allow {
		background: #f22d00;
		cursor: pointer;
	}
</style>
