<template>
	<div id="home">
		<div id="container">
			<el-row>
				<!-- 一级菜单 -->
				<el-col :span="4" :offset="1" class="cateList">
					<div class="cate_img" @click="searchGoods('')">
						<i class="el-icon-office-building"></i>
						商品分类
					</div>
					<el-menu background-color="#545c64" text-color="#fff" active-text-color="#fff">
						<el-menu-item index="cate.cateId" v-for="(cate) in cateList" :key="cate.cateId" @click="searchGoods(cate.cateId)">
							<span slot="title">{{cate.cateName}}</span>
						</el-menu-item>
					</el-menu>
				</el-col>
				<!--轮播图-->
				<el-col :span="14">
					<el-carousel height="320px" v-if="homecasual.length > 0">
						<el-carousel-item v-for="(casual) in homecasual" :key="casual.homecasualId">
							<img :src="casual.homecasualUrl" alt="">
						</el-carousel-item>
					</el-carousel>
				</el-col>
				<!-- 登录信息板块 -->
				<el-col :span="4" class="con_log">
					<div>
						<img :src="userInfo.userAvatar" v-if="userInfo.userAvatar" />
						<img src="~assets/img/no_login.png" v-else />
					</div>
					<p style="margin-top: 20px;">Hi~ 欢迎来到网上服装商城</p>
					<p v-if="!userInfo.userName" style="margin-top: 40px;">
						<router-link to="/userlogin">登录</router-link>
						<router-link to="/userreg">注册</router-link>
					</p>
					<p v-else class="userIn">
						<a v-if="userInfo.nickName" style="margin-top: 30px;">您好,{{ userInfo.nickName }}</a>
						<a v-else style="margin-top: 30px;">您好,{{ userInfo.userName }}</a>
						<router-link to="/me" style="margin-top: 30px;">个人中心</router-link>
					</p>
					<div class="rightBtn">
						<button class="welfare">新人福利</button>
						<button class="vip">加入会员</button>
					</div>
				</el-col>
			</el-row>

			<!-- 分类产品展示区域 -->
			<div class="product" v-for="(cate) in cateList" :key="cate.cateId">
				<div class="pro_line">
					<h3>{{ cate.cateName }}</h3><div><a @click="searchGoods(cate.cateId)">MORE</a></div>
				</div>
				<div class="pro_show">
          <ProductItem v-for="(pro) in homeGoodsList[cate.cateId - 1]" :key="pro.goodsId" :pro="pro"/>
				</div>
			</div>
		</div>
		<div class="end_show"></div>

			<!-- 尾部 -->
			<!-- <div id="footer">
			<img src="./img/footer.png" />
			<div class="footer_text"></div>
		</div> -->
		</div>
	</div>
</template>

<script>
	import {
		getCateList,
		getHomeCasual,
		isUser,
		getHomeGoods
	} from 'network/user'
	import ProductItem from 'components/productItem/ProductItem'
	export default {
		name: 'Home',
		components:{
			ProductItem
		},
		data() {
			return {
				homeGoodsList:[],
				cateList: [],
				homecasual: [],
				userInfo: {}
			}
		},
		async created() {
			this.isUserLogin();
			this.getCategories();
			this.getCasual();
			this.getGoods();
		},
		mounted() {
			this.$bus.$on('userLayout', () => {
				this.isUserLogin()
			})
		},
		methods: {
			//获取分类列表
			async getCategories() {
				let {
					categories,
				} = await getCateList({})
				this.cateList = categories;
			},
			//获取轮播图
			async getCasual() {
				let {
					homecasual,
				} = await getHomeCasual({})
				this.homecasual = homecasual;
			},
			//判断用户是否为登录状态
			async isUserLogin() {
				let result = await isUser();
				if (result.status_code !== 400) {
					this.userInfo = result.userInfo;
				} else {
					this.userInfo = {};
				}
			},
			//获取首页商品列表
			async getGoods() {
				let {
					goodsList,
				} = await getHomeGoods({})
				this.homeGoodsList = goodsList;
			},
			//根据分类搜索商品
			searchGoods(cateId){
			    this.$router.push({path:'/searchgoods',query:{goodsCategory:cateId}});
			},
		}
	}
</script>

<style scoped>
	#home {
		font-family: "Microsoft YaHei";
	}

	/*产品展示、购买、分类简介区*/
	#container {
		position: relative;
		margin: 60px auto;
		width: 100%;
		max-width: 1200px;
		/* background: rgba(245, 245, 245, 0.5); */
	}

	#container .el-row .el-col {
		height: 100%;
	}

	.el-row .cateList .cate_img {
		width: 100%;
		text-indent: 14px;
		height: 40px;
		color: #FFF;
		line-height: 40px;
		font-size: 16px;
		background: #F10215;
	}

	.el-menu-item {
		position: relative;
		left: 1px;
	}

	/*自动播放图片区域*/
	.el-col .el-carousel {
		height: 100%;
		/* border-top: 2px solid #FF0036; */
	}

	.el-carousel .el-carousel__item img {
		height: 100%;
		width: 100%;
	}

	/*一级菜单*/

	/*展示登录信息区域*/
	#container .el-row .con_log {
		position: relative;
		left: -2px;
		background: #F8F9FA;
		text-align: center;
		font-size: 15px;
		color: #989898;
		/* border: 1px solid #ccc; */
		height: 320px;
	}

	.con_log>div {
		position: relative;
		background-color: #F8F9FA;
		border-radius: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 70px;
		height: 70px;
	}

	.con_log>div>img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		box-shadow: 3px 3px 5px 5px #E3E3E3;
	}

	.con_log>p {
		margin-bottom: 20px;
	}

	.con_log>p>a {
		font-size: 13px;
		margin-right: 10px;
		margin-bottom: 5px;
		color: #666;
		cursor: pointer;
		text-decoration: none;
	}

	.con_log>.userIn>a {
		display: block;
	}

	.con_log>p>a:hover {
		color: red;
		font-weight: 700;
	}

	.con_log>.rightBtn {
		position: absolute;
		bottom: -20px;
		width: 100%;
	}

	.con_log>div>button {
		margin-right: 5px;
		width: 70px;
		height: 25px;
		line-height: 25px;
		font-size: 12px;
		text-align: center;
		border-radius: 13px;
		box-shadow: 6px 8px 20px rgba(45, 45, 45, 0.15);
		transition: background 0.3s ease, color 0.3s ease;
		outline: none;
		border: none;
	}

	.con_log>div>button.welfare {
		color: #e43f3b;
		background: white;
	}

	.con_log>div>button.vip {
		color: #e5d790;
		background: #2d2d2a;
	}

	.con_log>div>button:hover {
		color: white;
		background: #e43f3b;
	}

	/*每类产品的简单展示*/
	#container>.product {
		margin-top: 50px;
		width: 100%;
		height: 300px;
	}

	.product>.pro_line {
		width: 100%;
		height: 50px;
		text-align: center;
		line-height: 50px;
		font-size: 26px;
		font-family: sans-serif;
		font-weight: normal;
		color: #222;
		margin-bottom: 20px;
	}

	.pro_line>h3 {
		display: inline-block;
	}

	.pro_line>div {
		display: inline-block;
		margin-left: 15px;
		cursor: pointer;
	}

	.pro_line>div>a {
		color: red;
		font-weight: 700;
		font-size: 17px;
		text-decoration: none;
		transition: 0.5s;
	}

	.pro_line>div>a:after {
		content: '»';
		opacity: 0;
		/*opacity属性不占用文档流的空间*/
		transition: 0.5s;
	}

	.pro_line>div:hover a:after {
		opacity: 1;
	}

	.product>.pro_show {
		margin: 0 auto;
		padding-left: 20px;
		width: 980px;
		height: 200px;
	}

	.pro_1 {
		width: 100%;
		text-align: center;
		margin-top: 300px;
	}

	.pro_1>.item_content {
		width: 100%;
		text-align: center;
	}

	/*底部对商城的补充说明*/
	#footer {
		margin-top: -80px;
		width: 100%;
		height: 200px;
		background: #F0F3EF;
	}

	#footer>img {
		display: block;
		margin: 0 auto;
	}

	#footer>.footer_text {
		width: 100%;
		border-top: 1px solid #DEDEDE;
	}
</style>
