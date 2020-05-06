<template>
	<div id="SearchGoods">
		<div class="container">
			<el-card>
				<!-- 商品搜索及添加 -->
				<el-row :gutter="25">
					<el-col :span="15">
						<el-select v-model="goodsCategory" clearable placeholder="全部商品" @change="searchGoods" style="width: 180px;">
							<el-option v-for="item in cateList" :key="item.cateId" :label="item.cateName" :value="item.cateId">
							</el-option>
						</el-select>
					</el-col>
				</el-row>
				<div class="pro_show">
					<!-- 商品展示区域 -->
					<div v-if="!goodsList.length" style="margin: 30px auto 50px;"><h2>找不到您想要的商品</h2></div>
						<div>
					    <ProductItem v-for="(pro) in currentPage" :key="pro.goodsId" :pro="pro" style="height: 190px;margin: 0 26px;"/>
						</div>
					<!-- 分页区域 -->
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum"
					 :page-sizes="[3, 6, 9, 12]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
					</el-pagination>
				</div>
			</el-card>
		</div>
	</div>
</template>

<script>
	import ProductItem from 'components/productItem/ProductItem'
	import {
		getCateList,
		getGoodsList
	} from 'network/user'
	export default {
		nane: 'SearchGoods',
		components: {
			ProductItem
		},
		data() {
			return {
				goodsList: [],
				cateList: [],
				goodsCategory: '',
				goodsId:'',
				//数据总条数
				total: 0,
				//当前页面
				pagenum: 1,
				//当前每页所显示的数据条数
				pagesize: 3,
				//当前页面数据储存容器
				currentPage: [],
			}
		},
		created() {
			this.getCategories();
			this.getGoods();
			this.goodsId = this.$route.query.goodsName;
			this.goodsCategory = this.$route.query.goodsCategory;
		},
		mounted(){
				this.$bus.$on('serchGoodsName',goodsName=>{
				this.goodsId = goodsName;
				this.searchGoods();
			})
		},
		watch:{
			//监听搜索栏
			goodsId(){
				this.searchGoods();
			},
			goodsCategory(){
				this.searchGoods();
			}
		},
		methods: {
			//获取分类列表
			async getCategories() {
				let {
					categories,
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
			// 监听pagesize改变事件
			handleSizeChange(newsize) {
				this.pagesize = newsize;
				this.setCurPage(this.pagenum);
			},
			// 监听页码值改变
			handleCurrentChange(newpage) {
				this.setCurPage(newpage);
			},
			setCurPage(page) {
				this.currentPage = this.goodsList.slice(
					(page - 1) * this.pagesize,
					page * this.pagesize)
			},
		},
	}
</script>

<style scoped>
	#SearchGoods {
		position: relative;
		margin: 40px auto;
		width: 100%;
		height: 300px;
	}

	.container {
		margin: 40px auto;
		width: 1100px;
		height: 300px;
	}
	
	.pro_show{
		display: flex;
		flex-direction: column;
		margin-top: 30px;
	}
</style>
