import express from 'express'
import md5 from 'blueimp-md5'
import {
	User
} from '../db/db'
import {
	sendMail,
	randomNum
} from '../util/util'
const router = express.Router();

const S_KEY = 'leavehao@foxmail.com' //盐

//验证邮箱
router.get('/sendmail', (req, res) => {
	let userEmail = req.query.userEmail;
	let confirmMes = randomNum();
	req.session.confirmMes = confirmMes;
	console.log(confirmMes)
	sendMail(userEmail, '网上服装商城系统', `Hi,您的注册验证码是:${confirmMes}`);
	res.json({
		status_code: 200,
		message: '验证码已发送'
	})
})

//检查用户名是否已注册
router.get('/checkname', async (req, res) => {
	let userName = req.query.userName;
	let isNameReg = await User.findOne({
		userName
	})
	if (isNameReg) {
		res.json({
			status_code: 400,
			message: '用户名已注册'
		})
	} else {
		res.json({
			status_code: 200,
			message: '用户名可以使用'
		})
	}
})

//检查邮箱是否已注册
router.get('/checkemail', async (req, res) => {
	let userEmail = req.query.userEmail;
	let isEmailReg = await User.findOne({
		userEmail
	})
	if (isEmailReg) {
		res.json({
			status_code: 400,
			message: '邮箱已注册'
		})
	} else {
		res.json({
			status_code: 200,
			message: '邮箱可以使用'
		})
	}
})

//注册用户
router.post('/register', async (req, res) => {
	let regFrom = req.body;
	// console.log(regFrom, req.session.confirmMes);
	if (regFrom.confirmMes === req.session.confirmMes) {
		User.create({
			userName: regFrom.userName,
			password: md5(md5(regFrom.userPsw) + S_KEY), //加密密码
			userEmail: regFrom.userEmail,
			userPhone: regFrom.userPhone,
			userSex: regFrom.userSex,
			userAdress: regFrom.userAdress,
			userSign: regFrom.userSign,
			userAvatar: regFrom.userAvatar,
			nickName: regFrom.nickName
		}, (err, doc) => {
			console.log(err, doc)
			if (!err) {
				res.json({
					status_code: 200,
					message: '注册成功',
				})
			} else {
				res.json({
					status_code: 400,
					message: '内部错误,注册失败',
				})
			}
		})
	} else {
		res.json({
			status_code: 400,
			message: '验证码错误',
		})
	}
})

//用户登录
router.post('/login', async (req, res) => {
	let userName = req.body.userName;
	let userPsw = md5(md5(req.body.userPsw) + S_KEY);
	let resultName = await User.findOne({
		userName
	})
	let resultEmail = await User.findOne({
		userEmail: userName
	})
	if (resultName || resultEmail) {
		if (resultName) {
			if (userPsw === resultName.password) {
				req.session.user = resultName.userName;
				res.json({
					status_code: 200,
					message: '登录成功',
					userName: resultName.userName
				})
			} else {
				res.json({
					status_code: 400,
					message: '密码错误'
				})
			}
		} else {
			if (userPsw === resultEmail.password) {
				req.session.user = resultEmail.userName;
				res.json({
					status_code: 200,
					message: '登录成功',
					userName: resultEmail.userName
				})
			} else {
				res.json({
					status_code: 400,
					message: '密码错误'
				})
			}
		}
	} else {
		res.json({
			status_code: 400,
			message: '用户名或邮箱不存在'
		})
	}
})

//验证是否是用户
router.get('/isuser', async (req, res) => {
	if (!req.session.user) {
		res.json({
			status_code: 400,
			message: '未登录'
		})
	} else {
		let result = await User.findOne({
			userName: req.session.user
		})
		res.json({
			status_code: 200,
			message: '登录状态',
			userName: result.nickName || req.session.user
		})
	}
})

//退出登录
router.get('/logout', (req, res) => {
	req.session.user = '';
	res.json({
		status_code: 200,
		message: '已退出登录'
	})
})

export default router;
