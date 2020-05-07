<template>
	<div id="container">
		<div class="pro_detail">
			<div class="pro_img">
				<div class="tb_booth">
					<img :src="goodsInfo.goodsImg" class="pro_middle_img" />
				</div>
			</div>
			<div class="pro_meg">
				<div class="pro_meg_hd">
					<h1>
						{{goodsInfo.goodsName}}
					</h1>
				</div>
				<div class="pro_meg_price">
					<dl>
						<dt>促销价</dt>
						<dd>
							<div class="promo_price">
								<span class="tm-price">{{goodsInfo.normalPrice | showPrice}}</span>
								<b>优惠促销</b>
							</div>
						</dd>
					</dl>
					<dl>
						<dt>市场价</dt>
						<dd class="nor_price">{{goodsInfo.goodsPrice | showPrice }}</dd>
					</dl>
					<dl>
						<dt>本店优惠</dt>
						<dd>包邮</dd>
					</dl>
					<dl>
						<dt>卖家寄语</dt>
						<dt class="sale_tip">{{goodsInfo.salesTips}}</dt>
					</dl>
					<dl>
						<dt>服务承诺</dt>
						<dd>
							<span>正品保证</span>
							<span>极速退货</span>
						</dd>
					</dl>
				</div>
				<div class="pro_meg_deliver">
					<dl>
						<dt>运费</dt>
						<dd v-if="$store.state.userInfo.userAdress">湖北省武汉市&nbsp;&nbsp;至&nbsp;&nbsp;{{ $store.state.userInfo.userAdress.replace(/,/g, "")}}&nbsp;&nbsp;&nbsp;快递:0.00</dd>
						<dd v-else>湖北省武汉市&nbsp;&nbsp;至&nbsp;&nbsp;湖北省武汉市&nbsp;&nbsp;&nbsp;快递:0.00</dd>
					</dl>
				</div>
				<div class="pro_meg_console">
					<dl class="tb-sku">
						<dt>数量</dt>
						<dd>
							<div class="item-amout">
								<el-input-number v-model="shopNum" :min="1" :max="goodsInfo.counts"></el-input-number>
							</div>
							<div style="position: relative;bottom: 10px;"><span>库存</span><em>{{goodsInfo.goodsCounts}}</em><span>件</span></div>
						</dd>
					</dl>
					<div>
						<dl class="tb-sku" style="margin-top: 25px;">
							<dt>尺码</dt>
							<dd>
								<div class="item-amout">
									<el-select v-if="goodsInfo.goodsCategory=='1'||goodsInfo.goodsCategory=='2'" v-model="goodsSize" clearable placeholder="请选择尺码" style="width: 180px;">
										<el-option v-for="(item,index) in cloth"
										 :key="index" :label="item" :value="item">
										</el-option>
									</el-select>
									<el-select v-else-if="goodsInfo.goodsCategory=='3'" v-model="goodsSize" clearable placeholder="请选择尺码" style="width: 180px;">
										<el-option v-for="(item,index) in shoes"
										 :key="index" :label="item" :value="item">
										</el-option>
									</el-select>
									<el-select v-else v-model="goodsSize" clearable placeholder="请选择尺码" style="width: 180px;">
										<el-option label="均码" value="均码">
										</el-option>
									</el-select>
								</div>
							</dd>
						</dl>
					</div>
					<div class="shopping_car">
						<el-button type="danger" @click="addGoods">加入购物车</el-button>
					</div>
				</div>
			</div>
		</div>
		<div class="pro_comment">
			<h3>商品评价</h3>
			<div v-if="goodsInfo.goodsComments">
				<div class="media" v-for="(comment, index) in commentsList" :key="index">
					<div class="media-body">
						<h6 class="media-heading" v-if="comment.nickName">用户:&nbsp;{{ comment.nickName }}</h6>
						<h6 class="media-heading" v-else>用户:&nbsp;{{ comment.userName }}</h6>
						<span>评论:</span>&nbsp;{{comment.commentDetail}}
						<el-rate v-model="comment.comnentRating" disabled show-score text-color="#ff9900">
						</el-rate>
					</div>
				</div>
			</div>
			<div class="media" v-else>
				<div class="media-body">
					本商品暂无评论
				</div>
			</div>
		</div>
		<div class="pro_judge" v-if="$store.state.userName">
			<h3>评价该商品</h3>
			<span>为该商品评分</span>
			<el-rate v-model="rating" :colors="colors" show-score text-color="#ff9900">
			</el-rate>
			<el-input type="textarea" autosize placeholder="请输入内容" v-model="textarea">
			</el-input>
			<el-button type="primary" @click="post">发布<i class="el-icon-edit el-icon--right"></i></el-button>
		</div>
		<div class="pro_judge" v-else>
			<h3>评价该商品</h3>
			<span class="judge_erro_tip">登录后才可发表评论</span>
		</div>
	</div>
</template>

<script>
	import {
		getGoodsList,
		getCommentList,
		postComment,
		addGoodsToCart,
		isUser
	} from 'network/user'
	export default {
		data() {
			return {
				cloth: ["S", "M", "L", "XL"],
				shoes:["36","37","38","39","40","41","42","43"],
				goodsSize: '',
				goodsInfo: {},
				commentsList: [],
				goodsSize: '',
				textarea: '',
				rating: 0,
				colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
				currentGoodsId: 0,
				shopNum: 1,
			}
		},
		filters: {
			showPrice(price) {
				return Number(price).toFixed(2);
			},
		},
		created() {
			this.searchGoods(this.$route.query.goodsId);
			this.getComments(this.$route.query.goodsId);
		},
		methods: {
			//获取商品信息
			async searchGoods(goodsId) {
				let {
					goods,
				} = await getGoodsList({
					goodsId
				})
				this.goodsInfo = goods[0];
			},
			//获取评论信息
			async getComments(goodsId) {
				let {
					comments,
				} = await getCommentList({
					goodsId
				})
				this.commentsList = comments;
			},
			//评论
			async post() {
				if (!this.textarea) {
					this.$msgbox({
						type: 'info',
						message: "评论不得为空",
						showClose: true,
					});
					return;
				}
				let commitInfo = {
					goodsId: this.$route.query.goodsId,
					userName: this.$store.state.userInfo.userName,
					nickName: this.$store.state.userInfo.nickName,
					commentDetail: this.textarea,
					comnentRating: this.rating
				}
				let result = await postComment(commitInfo);
				console.log(result)
				if (result.status_code === 200) {
					this.$message({
						type: 'success',
						message: result.message,
						showClose: true,
					});
					//刷新评论列表
					this.getComments(this.$route.query.goodsId);
					this.textarea = '';
				} else {
					this.$msgbox({
						type: 'info',
						message: result.message,
						showClose: true,
					});
				}
			},
			//添加购物车
			async addGoods() {
				//判断用户是否为登录状态
				let result = await isUser();
				if(!this.goodsSize){
					this.$msgbox({
						type: 'info',
						message: '请选择尺码',
						showClose: true,
					});
					return;
				}
				if (result.status_code !== 400) {
					let addGoodsToCartInfo = {
						goodsId: this.goodsInfo.goodsId,
						shortName: this.goodsInfo.shortName,
						goodsName: this.goodsInfo.goodsName,
						goodsCategory: this.goodsInfo.goodsCategory,
						userName: this.$store.state.userInfo.userName,
						goodsSize: this.goodsSize,
						goodsCounts: this.goodsInfo.goodsCounts,
						buyCounts: this.shopNum,
						normalPrice: this.goodsInfo.normalPrice,
						goodsImg: this.goodsInfo.goodsImg
					}
					let result = await addGoodsToCart(addGoodsToCartInfo);
					if (result.status_code === 200) {
						this.$msgbox({
							type: 'success',
							message: result.message,
							showClose: true
						});
						this.shopNum = 1;
					} else {
						this.$msgbox({
							type: 'error',
							message: result.message,
							showClose: true,
						});
					}
				} else {
					this.$msgbox({
						type: 'info',
						message: '请先登录',
						showClose: true,
					});
				}
			}
		},
	}
</script>

<style scoped>
	#container>.pro_detail {
		display: flex;
		justify-content: center;
		width: 990px;
		position: relative;
		z-index: 100;
		margin: 20px auto;
	}

	#container>.pro_comment {
		width: 73%;
		position: relative;
		margin: 40px auto 0;
		padding: 20px;
		border: 1px solid #ccc;
		border-bottom: none;
	}

	#container>.pro_judge {
		width: 73%;
		position: relative;
		margin: 0 auto 60px;
		padding: 20px;
		border-top: none;
		border: 1px solid #ccc;
	}

	.pro_judge>span {
		font-size: 12px;
		color: #ccc;
	}

	.pro_judge>.el-rate {
		display: inline-block;
	}

	.pro_judge .el-textarea {
		width: 50%;
		display: block;
		margin: 20px 0;
	}

	.pro_comment>h3 {
		font-weight: bold;
		margin-bottom: 20px;
	}

	.pro_comment .media {
		border-top: 1px dashed #ccc;
		padding: 10px 0;
	}

	.pro_comment .media .media-heading {
		margin-bottom: 10px;
		font-weight: bolder;
	}

	.pro_comment .media .media-body {
		font-size: 15px;
	}

	.pro_comment .media .media-body span {
		font-weight: bolder;
	}

	.pro_comment .el-rate {
		display: inline-block;
		margin-left: 20px;
	}

	.pro_judge>h3 {
		font-weight: bold;
		margin-bottom: 20px;
	}

	.pro_judge .judge_erro_tip {
		font-size: 15px;
		font-weight: bolder;
		color: #000;
	}

	.pro_detail>.pro_img {
		position: relative;
		/* width: 450px; */
		/* height: 480px; */
		padding: 50px 0;
		border: 1px solid #ccc;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.pro_img>.tb_booth {
		position: relative;
		z-index: 1;
	}

	.tb_booth>.pro_middle_img {
		height: 380px;
		/* height: auto; */
		min-width: 380px;
		max-width: 100%;
		max-height: 100%;
	}

	.pro_detail>.pro_meg {
		margin-left: 100px;
		color: #666;
		padding: 0 0 3px;
	}

	.pro_meg>.pro_meg_hd {
		padding: 0 10px 12px;
		color: #000;
	}

	.pro_meg_hd>h1 {
		font-size: 16px;
		font-weight: 700;
		color: #000;
	}

	.pro_meg>.pro_meg_price {
		margin-top: 10px;
		padding: 5px 20px;
		height: 200px;
		background-color: rgba(247, 244, 244, 0.6);

		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}

	.pro_meg_price dl {
		display: flex;
		align-items: center;

		margin-bottom: 0 !important;
		cursor: pointer;
	}

	.pro_meg_price dl dt {
		width: 70px;
		color: #999;
		font-size: 12px;
	}

	.pro_meg_price dl dd {
		margin-bottom: 0 !important;
		font-family: Arial;
	}

	.pro_meg_price dl dd div {
		display: flex;
		align-items: center;
	}

	.pro_meg_price dl:last-child dd {
		color: #FF0036;
		font-weight: bold;
		font-size: 12px;
	}

	.promo_price {
		line-height: 24px;
		vertical-align: middle;
		color: #FF0036;
		font-size: 18px;
		font-family: Arial;
		-webkit-font-smoothing: antialiased;
	}

	.promo_price b {
		display: inline-block;
		font-weight: normal;
	}

	.promo_price b:last-child {
		font-size: 12px;
		background: #f47a86;
		color: white;
		padding: 0 6px;
	}

	.promo_price>.tm-price {
		font-size: 20px;
		display: inline-block;
		margin-right: 12px;
		font-weight: bold;
	}

	.nor_price {
		text-decoration: line-through;
	}

	.sale_tip {
		color: #FF0036 !important;
		font-weight: bolder;
		width: 300px !important;
	}

	.pro_meg_deliver {
		margin: 20px 20px -15px 0;
		padding: 5px;
	}

	.pro_meg_deliver dl {
		padding: 5px;
		font-size: 14px;
		color: black;
		cursor: pointer;
	}

	.pro_meg_deliver dl dt {
		color: #999;
		font-size: 14px;
		text-align: left;
		width: 69px;
		margin: 0 0 0 8px;
		float: left;
	}

	.pro_meg_deliver dl dd {
		font-size: 13px;
	}

	.pro_meg_console {
		margin: 30px 20px 5px 0;
		padding: 5px;
	}

	.tb-sku {
		padding: 5px;
		font-size: 14px;
		color: black;
		cursor: pointer;
	}

	.tb-sku dt {
		color: #999;
		font-size: 14px;
		text-align: left;
		width: 69px;
		margin: 0 0 0 8px;
		float: left;
	}

	.tb-sku dd {
		font-size: 13px;
	}

	.tb-sku dd div {
		display: inline-block;
		margin-right: 20px;
	}

	.item-amout {
		height: 25px;
		position: relative;
		bottom: 10px;
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

	.shopping_car {
		margin-top: 50px;
		margin-left: 250px;
		display: flex;
		justify-content: center;
	}

	.shopping_car button {
		outline: none;
	}
</style>
