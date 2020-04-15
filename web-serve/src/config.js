const path = require('path')
export default {
	publicPath: path.join(__dirname, '../public'),	//静态资源路径
	host: 'localhost:27017',	//数据库地址
	user: '',	//数据库账号
	password:'',	//数据库密码
	database: 'shopmall',	//数据库名称
	cors: ['http://localhost:8080'],	//前端跨域请求地址
	port: 3000 ,	//监听的端口号
	secret:'leavehao@foxmail.com',	//session
	maxAge: 1000 * 60 * 60 * 6	,//session保存6个小时
}