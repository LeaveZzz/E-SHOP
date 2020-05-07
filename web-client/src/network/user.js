import {
	request
} from './request'

//验证邮箱
export function sendMail(params) {
	return request({
		url: '/user/sendmail',
		params
	})
}

//用户注册
export function userRegister(data) {
	return request({
		url: '/user/register',
		method: 'post',
		data
	})
}

//检查用户名是否已注册
export function checkName(params) {
	return request({
		url: '/user/checkname',
		params
	})
}

//检查邮箱是否已被注册
export function checkEmail(params) {
	return request({
		url: '/user/checkemail',
		params
	})
}

//用户登陆
export function userLogin(data) {
	return request({
		url: '/user/login',
		method: 'post',
		data
	})
}

//验证是否是用户
export function isUser() {
	return request({
		url: '/user/isuser'
	})
}

//退出登录
export function userLogout() {
	return request({
		url: '/user/logout'
	})
}

//获取分类列表
export function getCateList(params) {
	return request({
		url: '/user/catelist',
		params
	})
}

//获取轮播图列表
export function getHomeCasual() {
	return request({
		url: '/user/gethomecasual',
	})
}

//获取首页商品列表
export function getHomeGoods() {
	return request({
		url: '/user/gethomegoods',
	})
}

//获取商品列表
export function getGoodsList(params) {
	return request({
		url: '/user/goodslist',
		params
	})
}

//获取评论列表
export function getCommentList(params) {
	return request({
		url: '/user/commentlist',
		params
	})
}

//发表评论
export function postComment(data) {
	return request({
		url: '/user/postcomment',
		method: 'post',
		data
	})
}

//添加商品到购物车
export function addGoodsToCart(data) {
	return request({
		url: '/user/addgoodstocart',
		method: 'post',
		data
	})
}

//获取购物车列表
export function getCartList(params) {
	return request({
		url: '/user/getcartlist',
		params
	})
}

//更新购物车数据
export function updateCart(data) {
	return request({
		url: '/user/updatecart',
		method: 'post',
		data
	})
}

//删除购物车内商品
export function deleteCateGoods(params) {
	return request({
		url: '/user/deletecategoods',
		params
	})
}

//创建订单
export function createOrder(data) {
	return request({
		url: '/user/createorder',
		method: 'post',
		data
	})
}

//编辑用户信息
export function editUser(data) {
	return request({
		url: '/user/edituser',
		method: 'post',
		data
	})
}

//获取订单列表
export function getOrderList(params) {
	return request({
		url: '/user/orderlist',
		params
	})
}

//确认收货
export function receiveGoods(data) {
	return request({
		url: '/user/receivegoods',
		method: 'post',
		data
	})
}