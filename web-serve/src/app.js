import express from 'express'
import config from './config'
import indexRouter from '../routes/index'

import cookieParser from 'cookie-parser'
import logger from 'morgan'
import session from 'express-session'

const app = express();

//使用cors解决跨域问题
import cors from 'cors'
app.use(cors());

app.use(cookieParser());

//使用express-session保存用户登录状况
app.use(session({
	secret: config.secret,
	resave: false,
	saveUninitialized: true,
	cookie:{
		maxAge: config.maxAge
	}
}))

//请求体
import bodyParser from 'body-parser'
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