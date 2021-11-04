import express from 'express'
import config from './config'
import indexRouter from '../routes/index'

import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import session from 'express-session'

const app = express();

//使用cors解决跨域问题
app.use(cors({
	origin:config.cors,
	credentials:true
}));

app.use(cookieParser());

//使用express-session保存用户登录状况
app.use(session({
	secret: config.secret,
	name:'connect.sid',
	resave: false,
	saveUninitialized: true,
	cookie:{
		maxAge: config.maxAge
	}
}))

//请求体
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger('dev'));

//静态资源处理
app.use(express.static(config.publicPath));

//路由
app.use('/', indexRouter);

app.listen(config.port,()=>{
	console.log(`${config.port}端口已监听`)
})