import {
	request
} from './request'

//管理员登录
export function adminLogin(data) {
	return request({
		url: '/admin/login',
		method: 'post',
		data
	})
}

//验证管理员权限
export function isAdmin() {
	return request({
		url: '/admin/isadmin'
	})
}

//退出登录
export function adminLogout() {
	return request({
		url: '/admin/logout'
	})
}

//获取用户列表
export function getUserList(params) {
	return request({
		url: '/admin/userlist',
		params
	})
}

//添加用户
export function addUser(data) {
	return request({
		url: '/admin/adduser',
		method: 'post',
		data
	})
}

//编辑用户
export function editUser(data) {
	return request({
		url: '/admin/edituser',
		method: 'post',
		data
	})
}

//删除用户
export function deleteUser(params) {
	return request({
		url: '/admin/deleteuser',
		params
	})
}

//获取管理员列表
export function getAdminList(params) {
	return request({
		url: '/admin/adminlist',
		params
	})
}

//添加管理员
export function addAdmin(data) {
	return request({
		url: '/admin/addadmin',
		method: 'post',
		data
	})
}

//检查管理员是否已注册
export function checkName(params) {
	return request({
		url: '/admin/checkname',
		params
	})
}

//编辑管理员
export function editAdmin(data) {
	return request({
		url: '/admin/editadmin',
		method: 'post',
		data
	})
}

//删除管理员
export function deleteAdmin(params) {
	return request({
		url: '/admin/deleteadmin',
		params
	})
}

//获取分类列表
export function getCateList(params) {
	return request({
		url: '/admin/catelist',
		params
	})
}

//检查分类Id是否已存在
export function checkCateId(params) {
	return request({
		url: '/admin/checkcateid',
		params
	})
}

//检查分类名称是否已存在
export function checkCateName(params) {
	return request({
		url: '/admin/checkcatename',
		params
	})
}

//添加分类
export function addCate(data) {
	return request({
		url: '/admin/addcate',
		method: 'post',
		data
	})
}

//编辑分类
export function editCate(data) {
	return request({
		url: '/admin/editcate',
		method: 'post',
		data
	})
}

//删除分类
export function deleteCate(params) {
	return request({
		url: '/admin/deletecate',
		params
	})
}

//获取商品列表
export function getGoodsList(params) {
	return request({
		url: '/admin/goodslist',
		params
	})
}

//获取商品分类
export function getGoodsCate(params) {
	return request({
		url: '/admin/goodscate',
		params
	})
}

//检查商品ID是否已存在
export function checkGoodsId(params) {
	return request({
		url: '/admin/checkgoodsid',
		params
	})
}

//添加商品
export function addGoods(data) {
	return request({
		url: '/admin/addgoods',
		method: 'post',
		data
	})
}

//编辑商品
export function editGoods(data) {
	return request({
		url: '/admin/editgoods',
		method: 'post',
		data
	})
}

//删除商品
export function deleteGoods(params) {
	return request({
		url: '/admin/deletegoods',
		params
	})
}