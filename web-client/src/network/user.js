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
