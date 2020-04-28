import {
	ADD_ADMIN_NAME,
	ADD_USER_NAME,
	REMOVE_USER_NAME
} from 'store/mutation-types'
export default {
	//添加管理员用户名
	[ADD_ADMIN_NAME](state, payload) {
		state.adminName = payload.adminName;
	},
	//添加用户名
	[ADD_USER_NAME](state, payload) {
		state.userName = payload.userName;
	},
	//移除用户名，退出登录
	[REMOVE_USER_NAME](state) {
		state.userName = '';
	},
}
