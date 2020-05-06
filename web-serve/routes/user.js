import express from 'express'
import md5 from 'blueimp-md5'
import {
	User,
	Category,
	Homecasual,
	Goods,
	Comment,
	Order,
	Cart
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
			userInfo: result,
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

//获取分类列表
router.get('/catelist', async (req, res) => {
	let result;
	if (req.query.cateId) {
		result = await Category.find({
			cateId: req.query.cateId
		}).sort('cateId');
	} else {
		result = await Category.find({}).sort('cateId');
	}
	res.json({
		status_code: 200,
		message: '获取分类列表成功',
		total: result.length,
		categories: result
	})
})

//获取轮播图
router.get('/gethomecasual', async (req, res) => {
	let result = await Homecasual.find({}).sort('homecasualId');
	res.json({
		status_code: 200,
		message: '获取轮播图成功',
		homecasual: result
	})
})

//获取首页商品
router.get('/gethomegoods', async (req, res) => {
	let result = await Category.find({}).sort('cateId');
	let goodsList = [];
	for (let i = 0; i < result.length; i++) {
		let findGoods = await Goods.find({
			goodsCategory: result[i].cateId
		}).limit(3)
		goodsList.push(findGoods)
	}
	res.json({
		status_code: 200,
		message: '获取首页商品成功',
		goodsList: goodsList
	})
})

//获取商品列表
router.get('/goodslist', async (req, res) => {
	let result;
	if (req.query.goodsCategory) {
		if (req.query.goodsId) {
			let resultId = await Goods.find({
				goodsId: req.query.goodsId,
				goodsCategory: req.query.goodsCategory
			}).sort('goodsCategory');
			let resultName = await Goods.find({
				goodsName: {
					$regex: req.query.goodsId,
					$options: 'gi'
				},
				goodsCategory: req.query.goodsCategory
			}).sort('goodsCategory');
			if (resultId.length != 0) {
				result = resultId
			} else {
				result = resultName
			}
		} else {
			result = await Goods.find({
				goodsCategory: req.query.goodsCategory
			}).sort('goodsCategory');
		}
	} else {
		if (req.query.goodsId) {
			let resultId = await Goods.find({
				goodsId: req.query.goodsId
			}).sort('goodsCategory');
			let resultName = await Goods.find({
				goodsName: {
					$regex: req.query.goodsId,
					$options: 'gi'
				}
			}).sort('goodsCategory');
			if (resultId.length != 0) {
				result = resultId
			} else {
				result = resultName
			}
		} else {
			result = await Goods.find({});
		}
	}
	res.json({
		status_code: 200,
		message: '获取分类列表成功',
		total: result.length,
		goods: result
	})
})

//获取评论列表
router.get('/commentlist', async (req, res) => {
	let result = await Comment.find({
		goodsId: req.query.goodsId
	});
	res.json({
		status_code: 200,
		message: '获取评论列表成功',
		comments: result
	})
})

//发表评论
router.post('/postcomment', async (req, res) => {
	let commentInfo = req.body;
	let result = await Order.find({
		goodsId: commentInfo.goodsId,
		userName: commentInfo.userName,
		isSuccess: true
	});
	if (result.length) {
		Comment.create(commentInfo, async (err, doc) => {
			if (!err) {
				//查询该商品下评论条数
				let commentRes = await Comment.find({
					goodsId: commentInfo.goodsId
				});
				//更新商品内评论条数
				await Goods.updateOne({
					goodsId: commentInfo.goodsId
				}, {
					goodsComments: commentRes.length
				})
				res.json({
					status_code: 200,
					message: '评论成功',
				})
			} else {
				res.json({
					status_code: 400,
					message: '内部错误,评论失败',
				})
			}
		})
	} else {
		res.json({
			status_code: 400,
			message: '您未购买过该商品或订单还未完成',
		})
	}
})

//添加商品到购物车
router.post('/addgoodstocart', async (req, res) => {
	let cartInfo = req.body;
	console.log(cartInfo);
	let result = await Cart.find({
		goodsId: cartInfo.goodsId,
		userName: cartInfo.userName,
		goodsSize: cartInfo.goodsSize
	});
	if (result.length) {
		let count = Number(result[0].buyCounts) + Number(cartInfo.buyCounts)
		Cart.updateOne({
			userName: cartInfo.userName,
			goodsId: cartInfo.goodsId
		}, {
			buyCounts: count
		}).then(doc => {
			console.log(doc)
			res.json({
				status_code: 200,
				message: '购物车存在该商品,已更新数量'
			})
		})
	} else {
		Cart.create(cartInfo, (err, doc) => {
			if (!err) {
				res.json({
					status_code: 200,
					message: '添加购物车成功',
				})
			} else {
				res.json({
					status_code: 400,
					message: '内部错误,添加购物车失败',
				})
			}
		})
	}
})

//获取购物车列表
router.get('/getcartlist', async (req, res) => {
	let result = await Cart.find({
		userName: req.query.userName
	});
	res.json({
		status_code: 200,
		message: '获取购物车列表成功',
		carts: result
	})
})

//更新购物车商品个数
router.post('/updatecart', (req, res) => {
	Cart.updateOne({
		userName: req.body.userName,
		goodsId: req.body.goodsId
	}, {
		buyCounts: req.body.buyCounts
	}).then((doc) => {
		res.json({
			status_code: 200,
			message: '修改购物车商品数量成功',
		})
	}).catch(() => {
		res.json({
			status_code: 400,
			message: '内部错误,修改购物车商品数量失败',
		})
	})
})

//删除购物车内商品
router.get('/deletecategoods', (req, res) => {
	if (req.query.userName && req.query.goodsId && req.query.goodsSize) {
		Cart.findOneAndDelete({
			userName: req.query.userName,
			goodsId: req.query.goodsId,
			goodsSize: req.query.goodsSize
		}).then((doc) => {
			res.json({
				status_code: 200,
				message: '删除商品成功',
			})
		}).catch((err) => {
			res.json({
				status_code: 400,
				message: '内部错误,删除商品失败',
			})
		})
	} else {
		Cart.deleteMany({
			userName: req.query.userName
		}).then((doc) => {
			res.json({
				status_code: 200,
				message: '删除购物车内所有商品成功',
			})
		}).catch((err) => {
			res.json({
				status_code: 400,
				message: '内部错误,删除购物车内所有商品失败',
			})
		})
	}
})

//创建订单
router.post('/createorder', (req, res) => {
	let createOrderInfo = req.body;
	createOrderInfo.isSuccess = false;
	createOrderInfo.orderTime = new Date().getTime();
	createOrderInfo.receiverAdress = createOrderInfo.receiverAdress.join(',');
	console.log(createOrderInfo);
	Order.create(createOrderInfo, async (err, doc) => {
		//删除购物车内商品
		await Cart.findOneAndDelete({
			userName: createOrderInfo.userName,
			goodsId: createOrderInfo.goodsId,
			goodsSize: createOrderInfo.goodsSize
		})
		//更新商品库存
		let resultId = await Goods.find({
			goodsId: createOrderInfo.goodsId
		})
		await Goods.updateOne({
			goodsId: createOrderInfo.goodsId
		}, {
			goodsCounts: resultId[0].goodsCounts - Number(createOrderInfo.buyCounts)
		})
		if (!err) {
			console.log(doc)
			res.json({
				status_code: 200,
				message: '创建订单成功',
			})
		} else {
			console.log(err)
			res.json({
				status_code: 400,
				message: `商品ID:${createOrderInfo.goodsId},内部错误,创建订单失败`,
			})
		}
	})
})

export default router;
