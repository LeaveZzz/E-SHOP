import express from 'express'
import md5 from 'blueimp-md5'
import {
	Administrator
} from '../db/db'
const router = express.Router();

const S_KEY = 'leavehao@foxmail.com' //盐

//管理员登录
router.post('/login', async (req, res) => {
	const adminName = req.body.adminName;
	const adminPsw = md5(md5(req.body.adminPsw) + S_KEY);
	const result = await Administrator.findOne({
		adminName
	})
	if (result) {
		if (adminPsw === result.password) {
			req.session.admin = adminName;
			res.json({
				status_code: 200,
				message: '登录成功',
				adminKey: result.adminKey
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

//验证登录状态
router.get('/isadmin',(req,res)=>{
	if (!req.session.admin){
		res.json({
			status_code: 400,
			message: '请先登录'
		})
	}else{
		res.json({
			status_code: 200,
			message: '进入管理员界面'
		})
	}
})

//退出登录
router.get('/logout',(req,res)=>{
	req.session.admin = '';
	res.json({
		status_code: 200,
		message: '已退出登录'
	})
})

export default router;
