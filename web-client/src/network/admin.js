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

//添加管理员列表
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

//删除用户
export function deleteAdmin(params) {
	return request({
		url: '/admin/deleteadmin',
		params
	})
}