import mongoose from 'mongoose'
import config from '../src/config'

const password = config.password ? ':' + config.password + '@' : '';
const dbURL = `mongodb://${config.user}${password}${config.host}/${config.database}`;
mongoose.connect(dbURL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log(`${config.database}数据库连接成功!`))
	.catch(err => console.log(err, '数据库连接失败!'));

//设置管理员账号规则
const adminSchema = new mongoose.Schema({
	adminName: String,
	password: String,
	role: String
})
export const Administrator = mongoose.model('Administrator', adminSchema)

//设置用户账号规则
const userSchema = new mongoose.Schema({
	userName: String,
	password: String,
	userEmail: String,
	userPhone: String,
	userSex: String,
	userAdress: String,
	userSign: String,
	userAvatar: String,
	nickName: String
})
export const User = mongoose.model('User', userSchema)

//设置分类规则
const categorySchema = new mongoose.Schema({
	cateId: String,
	cateName: String,
	//此分类商品数量
	cateCounts: Number
})
export const Category = mongoose.model('Category', categorySchema)

//设置商品规则
const goodsSchema = new mongoose.Schema({
	goodsId: String,
	goodsName: String,
	shortName: String,
	goodsImg: String,
	//定价
	goodsPrice: String,
	//特价
	normalPrice: String,
	salesTips: String,
	goodsCategory: String,
	goodsCounts: Number,
	//评论条数
	goodsComments: Number
})
export const Goods = mongoose.model('Goods', goodsSchema)

//设置评论规则
const commentSchema = new mongoose.Schema({
	goodsId: String,
	userName: String,
	commentDetail: String,
	comnentRating : Number
})
export const Comment = mongoose.model('Comment', commentSchema)

// Administrator.create({
// 	adminName:'leaveHao',
// 	password:'a467faacecebb65bfff36d26b4d3a469',
// 	role:'超级管理员'
// },(err,doc)=>{
// 	console.log(err,doc)
// })

// User.create({
// 			userName:regFrom.userName,
// 			password:regFrom.userPsw,
// 			userEmail:regFrom.userEmail,
// 			userPhone:regFrom.userPhone,
// 			userSex:regFrom.userSex,
// 			userAdress:regFrom.userAdress,
// 			userSign:regFrom.userSign,
// 			userAvatar:regFrom.userAvatar,
// 		},(err,doc)=>{
// 			console.log(err,doc)
// 		})

// Category.create({
// 	cateId: '1',
// 	cateName: '上衣/clothing',
// 	cateCounts: 0
// }, (err, doc) => {
// 	console.log(err, doc)
// })

// Goods.create({
// 	goodsId: '2316452',
// 	goodsName: '秋季牛仔裤男青年修身弹力小脚裤2018新款韩版潮流男士小直筒长裤',
// 	shortName: '男士修身弹力小脚裤',
// 	goodsImg: 'http://t00img.yangkeduo.com/t11img/images/2018-07-15/6982d3a77481e146e9fb81dc31d3a546.jpeg',
// 	goodsPrice: '328',
// 	normalPrice: '188',
// 	salesTips: '已售8万+件',
// 	goodsCategory: '2',
// 	goodsCounts: 100,
// 	goodsComments: 2
// }, (err, doc) => {
// 	console.log(err, doc)
// })

// Comment.create({
// 	goodsId: '136590526',
// 	userName: '测试机器人1',
// 	commentDetail: '非常不错！',
// 	comnentRating : 5
// },(err,doc)=>{
// 	console.log(err,doc)
// })
