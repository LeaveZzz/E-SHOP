import express from 'express'
const router = express.Router();

router.get('/index',(req,res)=>{
	console.log(req.query);
	let userName = req.query.userName;
	let password = req.query.password;
	if (userName === 'Leo' && password === '980408') {
		res.json({
			success_code:200,
			message: userName
		})
	} else{
		res.send({
			error_code: 404,
			message: '用户名或密码不正确'
		})
	}
})

export default router;