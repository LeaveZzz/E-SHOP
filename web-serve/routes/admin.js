import express from 'express'
import md5 from 'blueimp-md5'
import {
	Administrator
} from '../db/db'
const router = express.Router();

const S_KEY = 'leavehao@foxmail.com' //盐

//管理员登录
router.post('/login', async (req, res) => {
	let adminName = req.body.adminName;
	let adminPsw = md5(md5(req.body.adminPsw) + S_KEY);
	let result = await Administrator.findOne({
		adminName
	})
	if (result) {
		if (adminPsw === result.password) {
			req.session.admin = adminName;
			res.json({
				status_code: 200,
				message: '登录成功',
			})
		} else {
			res.json({
				status_code: 400,
				message: '密码错误'
			})
		}
	} else {
		res.json({
			status_code: 400,
			message: '用户名不存在'
		})
	}
})

//设置后台访问权限
router.use((req, res, next) => {
	if (!req.session.admin) {
		res.json({
			status_code: 400,
			message: '无权访问'
		})
	}
	next();
})

// 验证登录状态,若未被中间件拦截则为登录状态
router.get('/isadmin', (req, res) => {
	res.json({
		status_code: 200,
		message: '进入管理员界面',
		adminName: req.session.admin
	})
})

//退出登录
router.get('/logout', (req, res) => {
	req.session.admin = '';
	res.json({
		status_code: 200,
		message: '已退出登录'
	})
})

export default router;
