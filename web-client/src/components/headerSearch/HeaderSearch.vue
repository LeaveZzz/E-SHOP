<template>
  <div class="header_container">
    <div class="header_img"><img src="~assets/img/Leo.jpg" /></div>
		<div class="header_search">
				<div>
					<input type="text" placeholder="搜索  商品名称" v-model="keywords"/>
          <el-button type="danger" icon="el-icon-search" @click="searchGoods"></el-button>
				</div>
		</div>
		<div class="shopping_bag" @click.prevent="goShopCar">
			<a><i class="el-icon-shopping-cart-2"></i>&nbsp;&nbsp;我的购物车</a>
		</div>
	</div>
</template>

<script>
  export default {
		name:'HeaderSearch',
    data(){
      return{
        keywords: ''
      }
    },
    methods:{
      goShopCar(){
        if(this.$store.state.userName){
          this.$router.replace('/cart');
        }else{
          this.$msgbox({
            type: 'info',
            message: "请先登录!",
			      showClose: true,
          });
        }
      },
      searchGoods(){
          this.$router.push({path:'/searchgoods',query:{goodsName:this.keywords}});
					this.$bus.$emit('serchGoodsName',this.keywords)
      },
    },
  }
</script>

<style scoped>
/*头部搜索区*/
.header_container{
	position: relative;
	margin: 0 auto;
	left: 50%;
	transform: translateX(-50%);
	width: 100%;
	max-width: 1300px;
  height: 140px;
  margin: 0;
  padding: 0;
}
/*商城标识图片区域*/
.header_container>.header_img{
	position: absolute;
	left: 40px;
	margin-top: 20px;
	width: 140px;
	height: 140px;
  border: 1px solid darkgray;
  box-shadow: 2px 4px 15px rgba(45,45,45,0.15);
  border-radius: 50%;
}
.header_img>img{
	width: 100%;
	height: 100%;
	border-radius: 50%;
}
/*鼠标移入图片实现3d动画*/
.header_img:hover{
	transform-style: preserve-3d;
	transform:rotateY(360deg);
    transition: all 1500ms;
    -moz-transform-style: preserve-3d;
	-moz-transform:rotateY(45deg);
	-moz-transition: all 1500ms;
}
.header_search{
	position: absolute;
	left: 50%;
	margin-left: -290px;
	margin-top: 70px;
}
.header_search div{
  display: flex;
  align-items: center;
}
.header_search input{
	padding-left: 10px;
	width: 390px;
	height: 35px;
	font-size: 14px;
	line-height: 35px;
	border: 2px solid #FF0236;
  border-right: none;
	outline: none;
}
.header_search button.el-button.el-button--danger{
  padding: 0;
  width: 60px;
  height: 35px;
	font-size: 18px;
  border-radius: 0;
  outline: none;

  display: flex;
  justify-content: center;
  align-items: center;
}
.header_search>p>a{
	display: inline-block;
	padding: 5px 10px;
	font-size: 12px;
	color: #999;
	cursor: pointer;
}
.header_search>p>a:hover{
	color: red;
}
/*头部的购物车标记区域*/
.header_container>.shopping_bag{
	position: absolute;
	margin-top: 70px;
	right: 120px;
	width: 190px;
	height: 35px;
	text-align: center;
	line-height: 35px;
	font-size: 12px;
	background: #f8f9fa;
	color: red;
	cursor: pointer;
}
.shopping_bag>img{
	display: inline-block;
	margin-left: 5px;
	margin-top: 5px;
	width: 17px;
	height: 17px;
}
.shopping_bag>a{
	color: red;
}
</style>
