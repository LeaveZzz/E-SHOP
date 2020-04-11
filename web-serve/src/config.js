const path = require('path')
export default {
	publicPath: path.join(__dirname, '../public'),	//静态资源路径
	port: 3000 ,	//端口号
	secret:'leavehao@foxmail.com',	//session
	maxAge: 1000 * 60 * 60 * 6	,//session保存6个小时
}