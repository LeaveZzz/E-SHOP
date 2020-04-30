import express from 'express'
import path from 'path'
import md5 from 'blueimp-md5'
import formidable from 'formidable'
import config from '../src/config.js'
import {
	Administrator,
	User
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

//获取用户列表
router.get('/userlist', async (req, res) => {
	let result;
	if(req.query.userName){
		result = await User.find({userName:{$regex:req.query.userName, $options:'gi'}});
	}else{
		result = await User.find({});
	}
	res.json({
		status_code: 200,
		message: '获取用户列表成功',
		total: result.length,
		users: result
	})
})

//添加用户
router.post('/adduser', (req, res) => {
	const form = new formidable.IncomingForm();
	form.uploadDir = config.uploadsAvatarPath; // 上传图片放置的文件夹
	form.keepExtensions = true; // 保持文件的原始扩展名
	form.parse(req, (err, fields, files) => {
		let avatar;
		if (fields.userSex == '男') {
			avatar = 'http://localhost:' + config.port + '/boy_avatar.svg'
		} else {
			avatar = 'http://localhost:' + config.port + '/girl_avatar.svg'
		}
		if (files.userAvatar) {
			avatar = 'http://localhost:' + config.port + '/avatar_uploads/' + path.basename(files.userAvatar.path);
		}
		let userInfo = {
			userName: fields.userName,
			password: md5(md5(fields.userPsw) + S_KEY), //加密密码
			userEmail: fields.userEmail,
			userPhone: fields.userPhone,
			userSex: fields.userSex,
			userSign: fields.userSign,
			userAdress: fields.userAdress,
			nickName: fields.nickName,
			// userAdress:fields.userAdress.replace(/,/g,''),
			userAvatar: avatar
		}
		User.create(userInfo, (err, doc) => {
			console.log(err, doc)
			if (!err) {
				res.json({
					status_code: 200,
					message: '添加用户成功',
				})
			} else {
				res.json({
					status_code: 400,
					message: '内部错误,添加用户失败',
				})
			}
		})
	})
})

//编辑用户
router.post('/edituser', (req, res) => {
	const form = new formidable.IncomingForm();
	form.uploadDir = config.uploadsAvatarPath; // 上传图片放置的文件夹
	form.keepExtensions = true; // 保持文件的原始扩展名
	form.parse(req, (err, fields, files) => {
		let avatar;
		let userInfo = {
			userName: fields.userName,
			userEmail: fields.userEmail,
			userPhone: fields.userPhone,
			userSex: fields.userSex,
			userSign: fields.userSign,
			userAdress: fields.userAdress,
			nickName: fields.nickName
		}
		if (files.userAvatar) {
			avatar = 'http://localhost:' + config.port + '/avatar_uploads/' + path.basename(files.userAvatar.path);
			userInfo.userAvatar = avatar
		}
		if (fields.userPsw) {
			userInfo.password = md5(md5(fields.userPsw) + S_KEY);	//加密密码
		}
		User.updateOne({userName:fields.userName},userInfo).then((doc)=>{
			res.json({
				status_code: 200,
				message: '修改用户成功',
			})
		}).catch((err)=>{
			res.json({
				status_code: 400,
				message: '内部错误,修改用户信息失败',
			})
		})
	})
})

//删除用户
router.get('/deleteuser', (req, res) => {
	let userName = req.query.userName;
	User.findOneAndDelete({userName}).then((doc)=>{
			res.json({
				status_code: 200,
				message: '删除用户成功',
			})
		}).catch((err)=>{
			res.json({
				status_code: 400,
				message: '内部错误,删除用户失败',
			})
		})
})

//获取管理员列表
router.get('/adminlist', async (req, res) => {
	let result;
	if(req.query.adminName){
		result = await Administrator.find({adminName:{$regex:req.query.adminName, $options:'gi'}});
	}else{
		result = await Administrator.find({});
	}
	res.json({
		status_code: 200,
		message: '获取管理员列表成功',
		total: result.length,
		administrators: result
	})
})

//添加管理员
router.post('/addadmin', (req, res) => {
		let regFrom = req.body;
		console.log(regFrom)
		let adminInfo = {
			adminName : regFrom.adminName,
			password : md5(md5(regFrom.adminPsw) + S_KEY), //加密密码
			role: regFrom.adminRole
		}
		Administrator.create(adminInfo, (err, doc) => {
			console.log(err, doc)
			if (!err) {
				res.json({
					status_code: 200,
					message: '添加管理员成功',
				})
			} else {
				res.json({
					status_code: 400,
					message: '内部错误,添加管理员失败',
				})
			}
		})
})

//检查管理员名是否已注册
router.get('/checkname', async (req, res) => {
	let adminName = req.query.adminName;
	let isNameReg = await Administrator.findOne({
		adminName
	})
	if (isNameReg) {
		res.json({
			status_code: 400,
			message: '该名称已注册'
		})
	} else {
		res.json({
			status_code: 200,
			message: '该名称可以使用'
		})
	}
})

//编辑管理员
router.post('/editadmin',async (req, res) => {
	let regFrom = req.body;
	console.log(regFrom);
	let adminInfo = {
		adminName : regFrom.adminName,
		role: regFrom.adminRole
	}
	if (regFrom.adminPsw) {
		adminInfo.password = md5(md5(regFrom.adminPsw) + S_KEY); //加密密码
	}
	console.log(adminInfo)
	Administrator.updateOne({adminName:regFrom.adminName},adminInfo).then((doc)=>{
		res.json({
			status_code: 200,
			message: '修改管理员信息成功',
		})
	}).catch((err)=>{
		res.json({
			status_code: 400,
			message: '内部错误,修改管理员信息失败',
		})
	})
})

//删除管理员
router.get('/deleteadmin', (req, res) => {
	let adminName = req.query.adminName;
	Administrator.findOneAndDelete({adminName}).then((doc)=>{
			res.json({
				status_code: 200,
				message: '删除管理员成功',
			})
		}).catch((err)=>{
			res.json({
				status_code: 400,
				message: '内部错误,删除管理员失败',
			})
		})
})

export default router;
