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