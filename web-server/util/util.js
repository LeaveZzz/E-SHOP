// 邮件发送,调用方法:sendMail('leavehao@foxmail.com','这是测试邮件', 'Hi,这是一封测试邮件');
import nodemailer from 'nodemailer'
import smtpTransport from 'nodemailer-smtp-transport'
import config from '../src/config'

let SmtpTransport = nodemailer.createTransport(smtpTransport({
	service: config.email.service,
	auth: {
		user: config.email.user,
		pass: config.email.pass
	}
}));

// recipient 收件人,subject 发送的主题,html 发送的内容
export function sendMail(recipient, subject, html) {
	SmtpTransport.sendMail({
		from: config.email.user,
		to: recipient,
		subject: subject,
		html: html
	}, function(error, response) {
		if (error) {
			console.log(error);
		}
		console.log('发送成功')
	});
}

//生成随机5位数验证码
export function randomNum() {
	var rnd = "";
	for (var i = 0; i < 5; i++)
		rnd += Math.floor(Math.random() * 10);
	return rnd;
}
